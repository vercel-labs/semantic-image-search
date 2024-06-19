import { getImages } from "@/lib/db/api";
import { ErrorComponent } from "./error";
import { ImageSearch } from "./image-search";

export const SuspendedImageSearch = async ({ query }: { query?: string }) => {
  const { images, error } = await getImages(query);

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return <ImageSearch images={images} query={query} />;
};
