import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<section className="page-loader-wrap" />}>
      <AdminLoginClient />
    </Suspense>
  );
}
