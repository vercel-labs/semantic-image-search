import { varchar, index, pgTable, vector, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { z } from "zod";

export const images = pgTable(
  "images",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: text("title").notNull(),
    description: text("description").notNull(),
    path: text("path").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const dbImageSchema = z.object({
  id: z.string(),
  embedding: z.array(z.number()),
  title: z.string(),
  path: z.string(),
  description: z.string(),
  similarity: z.number().optional(),
});

export type DBImage = z.infer<typeof dbImageSchema>;
