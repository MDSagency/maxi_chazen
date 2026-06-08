import { NextResponse } from "next/server";

type LoginBody = {
  password?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Requete invalide." }, { status: 400 });
  }

  const inputPassword = body.password?.trim() ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  if (!inputPassword) {
    return NextResponse.json(
      { error: "Mot de passe requis." },
      { status: 400 },
    );
  }

  if (inputPassword !== expectedPassword) {
    return NextResponse.json(
      { error: "Mot de passe incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "admin_auth",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
