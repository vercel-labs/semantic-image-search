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
        <div>
          <h1 className="font-semibold text-2xl">Semantic Search</h1>
        </div>
        <DeployButton />
      </div>
      <div>
        <p>
          This demo showcases how to use the{" "}
          <Link
            href="https://sdk.vercel.ai/docs"
            className="text-blue-600 hover:underline"
            target="_blank"
          >
            Vercel AI SDK
          </Link>{" "}
          to build semantic search applications. Try searching for something
          semantically, like &quot;tasty food&quot;.
        </p>
      </div>
      <div className="">
        <div className="pt-2">
          <SearchBox query={query} />
        </div>
        <Suspense fallback={<CardGridSkeleton />} key={query}>
          <SuspendedImageSearch query={query} />
        </Suspense>
      </div>
    </main>
  );
}
