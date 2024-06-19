import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { DeployButton } from "@/components/deploy-button";
import { SearchBox } from "@/components/search-box";
import { SuspendedImageSearch } from "@/components/suspended-image-search";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q;
  return (
    <main className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-2xl">Semantic Search</h1>
        <DeployButton />
      </div>
      <div className="py-2 space-y-2">
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
      </div>
      <div className="border-border border-t pt-2">
        <div className="pt-4">
          <SearchBox query={query} />
        </div>
        <Suspense fallback={<CardGridSkeleton />} key={query}>
          <SuspendedImageSearch query={query} />
        </Suspense>
      </div>
    </main>
  );
}
