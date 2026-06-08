import ContentManager from "@/components/admin/ContentManager";
import { getAllWebsiteContent } from "@/lib/actions/content";

export default async function AdminContentPage() {
  const content = await getAllWebsiteContent();
  return <ContentManager initialContent={content as Record<string, unknown>} />;
}
