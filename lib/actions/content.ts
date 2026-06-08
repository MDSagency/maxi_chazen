"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { updateContentSchema } from "@/lib/validations/content";
import {
  DEFAULT_WEBSITE_CONTENT,
  type WebsiteSection,
} from "@/lib/content/defaults";
import { logActivity } from "@/lib/activity";

export async function getWebsiteContent(section: WebsiteSection) {
  const row = await prisma.websiteContent.findUnique({ where: { section } });
  if (!row) return DEFAULT_WEBSITE_CONTENT[section];
  return row.content;
}

export async function getAllWebsiteContent() {
  const rows = await prisma.websiteContent.findMany();
  const map = { ...DEFAULT_WEBSITE_CONTENT } as Record<string, unknown>;

  for (const row of rows) {
    map[row.section] = row.content;
  }

  return map;
}

export async function updateWebsiteContent(input: unknown) {
  const session = await requireAdmin();
  const data = updateContentSchema.parse(input);

  const content = data.content as Prisma.InputJsonValue;

  await prisma.websiteContent.upsert({
    where: { section: data.section },
    create: {
      section: data.section,
      content,
      updatedBy: session.user.id,
    },
    update: {
      content,
      updatedBy: session.user.id,
    },
  });

  await logActivity({
    adminId: session.user.id,
    action: "update",
    entity: "website_content",
    entityId: data.section,
  });

  revalidatePath("/");
  revalidatePath("/admin/content");
}
