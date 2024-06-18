import dotenv from "dotenv";
import { getJpgFiles } from "./utils";
import { list, put } from "@vercel/blob";
import fs from "fs";

dotenv.config();

async function main() {
  const basePath = "images-to-index";
  const files = await getJpgFiles(basePath);
  const { blobs } = await list();

  for (const file of files) {
    const exists = blobs.some((blob) => blob.pathname === file);
    if (exists) {
      console.log(`File (${file}) already exists in Blob store`);
      continue;
    }
    const filePath = basePath + "/" + file;
    const fileContent = fs.readFileSync(filePath);

    console.clear();
    console.log(
      `Uploading ${file} (${files.indexOf(file) + 1}/${files.length}) to Blob storage`,
    );
    try {
      await put(file, fileContent, { access: "public" });
      console.log(`Uploaded ${file}`);
    } catch (e) {
      console.error(e);
    }
  }
  console.log("All images uploaded!");
  process.exit(0);
}

main().catch(console.error);
