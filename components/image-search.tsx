"use client";

import { ImageCard } from "./image-card";
import { DBImage } from "@/lib/db/schema";
import { useSearchParams } from "next/navigation";
import { NoImagesFound } from "./no-images-found";
import { SearchBox } from "./search-box";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { CardGridSkeleton } from "./card-grid-skeleton";

export const ImageSearch = (props: { images: DBImage[] }) => {
  const [images] = useState(props.images);

  const [loading, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div>
      <SearchBox query={query} startTransition={startTransition} />
      <div>
        {images && images.length === 0 && loading === false ? (
          <NoImagesFound query={query ?? ""} />
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 relative",
            )}
          >
            {loading ? (
              <CardGridSkeleton />
            ) : (
              images &&
              images?.map((image) => (
                <ImageCard
                  key={"image_" + image.id}
                  image={image}
                  similarity={image.similarity}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
