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
        <Badge variant={"default"} className="bg-green-100 text-green-700">
          Semantic Match: {similarity?.toFixed(3)}
        </Badge>
      ) : (
        <Badge variant={"secondary"}>Direct Match</Badge>
      )}
    </div>
  );
};
