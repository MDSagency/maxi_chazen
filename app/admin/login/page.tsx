import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Connexion — Administration Maxi Chazen",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    redirect(params.callbackUrl ?? "/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted">
          Maxi Chazen
        </p>
        <h1 className="mt-3 font-display text-3xl text-ink">Administration</h1>
        <p className="mt-2 text-sm text-muted">
          Connectez-vous pour gérer produits, commandes et contenu.
        </p>
        <AdminLoginForm callbackUrl={params.callbackUrl} />
      </div>
    </div>
  );
}
