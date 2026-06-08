import { z } from "zod";

export const contentSectionSchema = z.enum([
  "hero",
  "banners",
  "histoire",
  "testimonials",
  "homepage_images",
  "footer",
  "contact",
]);

export const updateContentSchema = z.object({
  section: contentSectionSchema,
  content: z.record(z.string(), z.unknown()),
});
