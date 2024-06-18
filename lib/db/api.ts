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
import { kv } from "@vercel/kv";

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

export const getImages = async (
  query?: string,
): Promise<{ images: DBImage[]; error?: Error }> => {
  try {
    const formattedQuery = query
      ? "q:" + query?.replaceAll(" ", "_")
      : "all_images";

    const cached = await kv.get<DBImage[]>(formattedQuery);
    if (cached) {
      return { images: cached };
    } else {
      if (query === undefined || query.length < 3) {
        const allImages = await db
          .select(imagesWithoutEmbedding)
          .from(images)
          .limit(20);
        await kv.set("all_images", JSON.stringify(allImages));
        return { images: allImages };
      } else {
        const directMatches = await findImageByQuery(query);
        const semanticMatches = await findSimilarContent(query);
        const allMatches = uniqueItemsByObject(
          [...directMatches, ...semanticMatches].map((image) => ({
            ...image.image,
            similarity: image.similarity,
          })),
        );

        await kv.set(formattedQuery, JSON.stringify(allMatches));
        return { images: allMatches };
      }
    }
  } catch (e) {
    if (e instanceof Error) return { error: e, images: [] };
    return {
      images: [],
      error: { message: "Error, please try again." } as Error,
    };
  }
};
