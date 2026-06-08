import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import AdminShell from "@/components/admin/AdminShell";
import { auth } from "@/lib/auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <SessionProvider session={session}>
      <AdminShell userName={session.user.name ?? session.user.email}>
        {children}
      </AdminShell>
    </SessionProvider>
  );
}
