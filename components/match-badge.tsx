import { Badge } from "@/components/ui/badge";

export const MatchBadge = ({
  type,
  similarity,
}: {
  type: "direct" | "semantic";
  similarity?: number;
}) => {
  return (
    <div className="">
      {type === "semantic" ? (
        <>
          <Badge
            variant={"default"}
            className="block sm:hidden bg-green-100 text-green-700"
          >
            Similarity: {similarity?.toFixed(3)}
          </Badge>
          <Badge
            variant={"default"}
            className="hidden sm:block bg-green-100 text-green-700"
          >
            Semantic Match: {similarity?.toFixed(3)}
          </Badge>
        </>
      ) : (
        <Badge variant={"secondary"}>Direct Match</Badge>
      )}
    </div>
  );
};
