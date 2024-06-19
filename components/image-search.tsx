"use client";
import { ImageCard } from "./image-card";
import { DBImage } from "@/lib/db/schema";
import { NoImagesFound } from "./no-images-found";
import { useSharedTransition } from "@/lib/hooks/use-shared-transition";
import { CardGridSkeleton } from "./card-grid-skeleton";

export const ImageSearch = ({
  images,
  query,
}: {
  images: DBImage[];
  query?: string;
}) => {
  const { isPending } = useSharedTransition();

  if (isPending) return <CardGridSkeleton />;

  if (images.length === 0) {
    return <NoImagesFound query={query ?? ""} />;
  }

  return <ImageGrid images={images} />;
};

const ImageGrid = ({ images }: { images: DBImage[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 relative">
      {images.map((image) => (
        <ImageCard
          key={"image_" + image.id}
          image={image}
          similarity={image.similarity}
        />
      ))}
    </div>
  );
};
