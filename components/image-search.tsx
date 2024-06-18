import { ImageCard } from "./image-card";
import { DBImage } from "@/lib/db/schema";
import { NoImagesFound } from "./no-images-found";

export const ImageSearch = ({
  images,
  query,
}: {
  images: DBImage[];
  query?: string;
}) => {
  if (images.length === 0) {
    return <NoImagesFound query={query ?? ""} />;
  }

  return <ImageGrid images={images} />;
};

const ImageGrid = ({ images }: { images: DBImage[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 relative">
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
