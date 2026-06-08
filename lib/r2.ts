import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicBaseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

function hasS3Credentials(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey && bucketName);
}

function hasApiTokenCredentials(): boolean {
  return Boolean(accountId && apiToken && bucketName);
}

export function isR2Configured(): boolean {
  return Boolean(
    publicBaseUrl && (hasS3Credentials() || hasApiTokenCredentials()),
  );
}

function getR2Client(): S3Client | null {
  if (!hasS3Credentials()) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });
}

function encodeObjectKey(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

async function uploadViaApiToken(
  file: Buffer,
  key: string,
  contentType: string,
): Promise<void> {
  const objectPath = encodeObjectKey(key);
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${objectPath}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body: new Uint8Array(file),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`R2 API upload failed (${response.status}): ${body}`);
  }
}

async function deleteViaApiToken(key: string): Promise<void> {
  const objectPath = encodeObjectKey(key);
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${objectPath}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${apiToken}` },
  });

  if (!response.ok && response.status !== 404) {
    const body = await response.text();
    throw new Error(`R2 API delete failed (${response.status}): ${body}`);
  }
}

export function buildOptimizedImageUrl(
  url: string,
  options?: { width?: number; quality?: number },
): string {
  const deliveryBase = process.env.CF_IMAGES_DELIVERY_URL?.replace(/\/$/, "");
  if (!deliveryBase || deliveryBase.includes(".r2.dev")) return url;

  const width = options?.width ?? 1200;
  const quality = options?.quality ?? 85;
  const encoded = encodeURIComponent(url);
  return `${deliveryBase}/cdn-cgi/image/width=${width},quality=${quality},format=auto/${encoded}`;
}

export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string,
): Promise<{ url: string; key: string } | null> {
  if (!bucketName || !publicBaseUrl) return null;

  const client = getR2Client();

  if (client) {
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } else if (hasApiTokenCredentials()) {
    await uploadViaApiToken(file, key, contentType);
  } else {
    return null;
  }

  const url = `${publicBaseUrl}/${key}`;
  return { url: buildOptimizedImageUrl(url), key };
}

export async function deleteFromR2(key: string): Promise<void> {
  if (!bucketName || !key) return;

  const client = getR2Client();

  if (client) {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
    return;
  }

  if (hasApiTokenCredentials()) {
    await deleteViaApiToken(key);
  }
}

export function buildStorageKey(folder: string, filename: string): string {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  return `${folder}/${Date.now()}-${safeName}`;
}
