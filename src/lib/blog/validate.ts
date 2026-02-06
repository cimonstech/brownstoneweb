import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().max(1000).optional().nullable(),
  cover_image: z.string().url().optional().nullable().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  read_time_minutes: z.number().int().min(1).max(120).optional().nullable(),
  featured: z.boolean().optional(),
});

export type PostInput = z.infer<typeof postSchema>;
