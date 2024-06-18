import dotenv from "dotenv";
import { embeddingModel, getMetadataFile } from "./utils";
import { embed } from "ai";
import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DBImage, dbImageSchema, images } from "../db/schema";

dotenv.config();

export const client = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(client);

const saveImage = async (image: DBImage) => {
  try {
    const safeImage = dbImageSchema.parse(image);
    const [savedImage] = await db.insert(images).values(safeImage);
    return savedImage;
  } catch (e) {
    console.error(e);
  }
};

async function main() {
  // read metadata json file
  const imagesWithMetadata = await getMetadataFile("images-with-metadata.json");

  // map over it and embed each .metadata key
  for (const image of imagesWithMetadata) {
    console.clear();
    console.log(
      `Generating embedding for ${image.path} (${imagesWithMetadata.indexOf(image) + 1}/${imagesWithMetadata.length})`,
    );

    // create embedding
    const { embedding } = await embed({
      model: embeddingModel,
      value: image.metadata.title + "\n" + image.metadata.description,
    });
    //

    console.log(
      `Saving ${image.path} to the DB (${imagesWithMetadata.indexOf(image) + 1}/${imagesWithMetadata.length})`,
    );
    // push to db
    try {
      await saveImage({
        title: image.metadata.title,
        description: image.metadata.description,
        id: nanoid(),
        path: image.path,
        embedding,
      });
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Successfully embedded and saved all images!");
  process.exit(0);
}

main().catch(console.error);
