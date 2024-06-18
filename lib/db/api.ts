"use server";

import {
  cosineDistance,
  desc,
  getTableColumns,
  gt,
  or,
  sql,
} from "drizzle-orm";
import { db } from ".";
import { DBImage, images } from "./schema";
import { generateEmbedding } from "../ai/utils";
import { createStreamableValue } from "ai/rsc";
import { kv } from "@vercel/kv";
import { ImageStreamStatus } from "../utils";

const { embedding: _, ...rest } = getTableColumns(images);
const imagesWithoutEmbedding = {
  ...rest,
  embedding: sql<number[]>`ARRAY[]::integer[]`,
};

export const findSimilarContent = async (description: string) => {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(images.embedding, embedding)})`;
  const similarGuides = await db
    .select({ image: imagesWithoutEmbedding, similarity })
    .from(images)
    .where(gt(similarity, 0.28)) // experiment with this value based on your embedding model
    .orderBy((t) => desc(t.similarity))
    .limit(10);

  return similarGuides;
};

export const findImageByQuery = async (query: string) => {
  const result = await db
    .select({ image: imagesWithoutEmbedding, similarity: sql<number>`1` })
    .from(images)
    .where(
      or(
        sql`title ILIKE ${"%" + query + "%"}`,
        sql`description ILIKE ${"%" + query + "%"}`,
      ),
    );
  return result;
};

function uniqueItemsByObject(items: DBImage[]): DBImage[] {
  const seenObjects = new Set<string>();
  const uniqueItems: DBImage[] = [];

  for (const item of items) {
    if (!seenObjects.has(item.title)) {
      seenObjects.add(item.title);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}

export const getImagesStreamed = async (query?: string) => {
  const streamableImages = createStreamableValue<DBImage[]>();
  const streamableStatus = createStreamableValue<ImageStreamStatus>({
    regular: true,
    semantic: false,
  });

  (async () => {
    try {
      const formattedQuery = query
        ? "q:" + query?.replaceAll(" ", "_")
        : "all_images";

      const cached = await kv.get<DBImage[]>(formattedQuery);
      if (cached) {
        streamableImages.done(cached);
        streamableStatus.done({ regular: false, semantic: false });
      } else {
        if (query === undefined || query.length < 3) {
          const allImages = await db
            .select(imagesWithoutEmbedding)
            .from(images)
            .limit(20);
          streamableImages.done(allImages);
          await kv.set("all_images", JSON.stringify(allImages));
        } else {
          streamableStatus.update({ semantic: true, regular: false });
          const directMatches = await findImageByQuery(query);
          streamableImages.update(
            directMatches.map((directMatch) => ({
              ...directMatch.image,
              similarity: directMatch.similarity,
            })),
          );
          const semanticMatches = await findSimilarContent(query);
          const allMatches = uniqueItemsByObject(
            [...directMatches, ...semanticMatches].map((image) => ({
              ...image.image,
              similarity: image.similarity,
            })),
          );

          streamableImages.done(allMatches);
          await kv.set(formattedQuery, JSON.stringify(allMatches));
        }
        streamableStatus.done({ regular: false, semantic: false });
      }
    } catch (e) {
      console.error(e);
    }
  })();
  return { images: streamableImages.value, status: streamableStatus.value };
};
