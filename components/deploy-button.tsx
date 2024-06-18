import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export const DeployButton = () => {
  return (
    <div className="flex items-center justify-end space-x-2">
      <a
        href="https://vercel.com/templates/next.js/semantic-image-search"
        target="_blank"
        className={cn(buttonVariants())}
      >
        <IconVercel className="mr-2" />
        <span className="hidden sm:block">Deploy to Vercel</span>
        <span className="sm:hidden">Deploy</span>
      </a>
    </div>
  );
};
function IconVercel({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-label="Vercel logomark"
      role="img"
      viewBox="0 0 74 64"
      className={cn("size-4", className)}
      {...props}
    >
      <path
        d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
