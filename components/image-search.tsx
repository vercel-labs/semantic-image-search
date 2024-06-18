"use client";

import { ImageCard } from "./image-card";
import { DBImage } from "@/lib/db/schema";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { useSearchParams } from "next/navigation";
import { NoImagesFound } from "./no-images-found";
import { SearchBox } from "./search-box";
import { useTransition } from "react";
import { ImageStreamStatus, cn } from "@/lib/utils";
import { LoadingSpinner } from "./loading-spinner";

export const ImageSearch = (props: {
  images: StreamableValue<DBImage[]>;
  status: StreamableValue<ImageStreamStatus>;
}) => {
  const [images] = useStreamableValue(props.images);
  const [status, , streamLoading] = useStreamableValue(props.status);

  const [loading, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div>
      <SearchBox query={query} startTransition={startTransition} />
      <div>
        {images &&
        images.length === 0 &&
        loading === false &&
        streamLoading === false ? (
          <NoImagesFound query={query ?? ""} />
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 relative",
            )}
          >
            {images &&
              images?.map((image) => (
                <ImageCard
                  key={"image_" + image.id}
                  image={image}
                  similarity={image.similarity}
                />
              ))}
            {loading || streamLoading ? (
              <LoadingSpinner status={status} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
