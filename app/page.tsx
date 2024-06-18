import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { DeployButton } from "@/components/deploy-button";
import { ImageSearch } from "@/components/image-search";
import { SearchBox } from "@/components/search-box";
import { getImages } from "@/lib/db/api";
import Link from "next/link";
import { Suspense } from "react";

export default function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q;
  return (
    <main className="p-8 space-y-4">
      <div className="flex justify-between">
        <h1 className="font-medium text-2xl">Semantic Image Search</h1>
        <DeployButton />
      </div>
      <p>
        This demo showcases how to use the{" "}
        <Link
          href="https://sdk.vercel.ai/docs"
          className="text-blue-600 hover:underline"
          target="_blank"
        >
          Vercel AI SDK
        </Link>{" "}
        to build semantic search applications.
      </p>
      <p>
        Search for an image! Your query will be embedded and then compared
        against the embedded image metadata (titles and descriptions generated
        by GPT-4o).
      </p>
      <div className="border-border border-t pt-4 space-y-4">
        <SearchBox query={query} />
        <Suspense fallback={<CardGridSkeleton />} key={query}>
          <SuspendedImageSearch query={query} />
        </Suspense>
      </div>
    </main>
  );
}

const SuspendedImageSearch = async ({ query }: { query?: string }) => {
  return <ImageSearch images={await getImages(query)} query={query} />;
};
