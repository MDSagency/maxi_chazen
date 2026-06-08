import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  buildStorageKey,
  isR2Configured,
  uploadToR2,
} from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`upload:${session.user.id}:${ip}`, 30, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez plus tard." },
      { status: 429 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") || "uploads");
  const productId = formData.get("productId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier requis." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Format non supporté." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (max 8 Mo)." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = buildStorageKey(folder, file.name);

  let url = "";
  let storageKey = key;

  if (isR2Configured()) {
    const uploaded = await uploadToR2(buffer, key, file.type);
    if (!uploaded) {
      return NextResponse.json({ error: "Échec upload R2." }, { status: 500 });
    }
    url = uploaded.url;
    storageKey = uploaded.key;
  } else {
    const base64 = buffer.toString("base64");
    url = `data:${file.type};base64,${base64}`;
    storageKey = "";
  }

  if (productId && typeof productId === "string") {
    const count = await prisma.productImage.count({ where: { productId } });
    await prisma.productImage.create({
      data: {
        productId,
        url,
        storageKey,
        alt: file.name,
        sortOrder: count,
        isPrimary: count === 0,
      },
    });

    await logActivity({
      adminId: session.user.id,
      action: "upload_image",
      entity: "product",
      entityId: productId,
    });
  }

  return NextResponse.json({ url, key: storageKey });
}
