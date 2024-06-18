/**
 * v0 by Vercel.
 * @see https://v0.dev/t/tm9EX5NO8KN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { ImageStreamStatus } from "@/lib/utils";

export function LoadingSpinner({ status }: { status?: ImageStreamStatus }) {
  return (
    <div className="absolute h-full w-full bg-white z-10 top-0 flex items-start justify-center">
      <div className="flex flex-col items-center space-y-4 pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent dark:border-gray-50 dark:border-t-transparent" />
        <p className="text-gray-500 dark:text-gray-400">
          Searching
          {status
            ? status?.regular
              ? " for direct matches"
              : " for semantic results"
            : ""}
          ...
        </p>
      </div>
    </div>
  );
}
