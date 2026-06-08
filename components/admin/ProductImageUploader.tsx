"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type ProductImageItem = {
  id: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
};

type Props = {
  productId: string | null;
  images: ProductImageItem[];
  disabled?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (imageId: string) => Promise<void>;
  onReorder: (imageIds: string[]) => Promise<void>;
  hint?: string;
};

export default function ProductImageUploader({
  productId,
  images,
  disabled,
  onUpload,
  onDelete,
  onReorder,
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (list.length === 0) return;

      setUploading(true);
      try {
        await onUpload(list);
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onUpload],
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-ink">Images du produit</p>
        <p className="mt-1 text-xs text-muted">
          {hint ??
            "Ajoutez une ou plusieurs photos. La première image sera l'image principale."}
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled && e.dataTransfer.files.length > 0) {
            void handleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
          disabled
            ? "cursor-not-allowed border-line bg-paper opacity-60"
            : dragging
              ? "border-brand-blue bg-brand-blue/5"
              : "border-line bg-paper hover:border-ink/30 hover:bg-white",
        )}
      >
        <span className="text-2xl text-muted" aria-hidden>
          ↑
        </span>
        <p className="mt-2 text-sm font-medium text-ink">
          {uploading
            ? "Envoi en cours..."
            : "Glissez vos images ici ou cliquez pour parcourir"}
        </p>
        <p className="mt-1 text-xs text-muted">JPG, PNG, WebP — max 8 Mo par fichier</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
          }}
        />
      </div>

      {!productId ? (
        <p className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 px-3 py-2 text-xs text-ink">
          Les images ajoutées ici seront envoyées sur Cloudflare R2 lorsque vous
          cliquerez sur « Créer le produit ».
        </p>
      ) : null}

      {sorted.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sorted.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border border-line bg-white"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
                {image.id.startsWith("pending-") ? (
                  <span className="absolute left-2 top-2 rounded bg-amber-500 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                    En attente
                  </span>
                ) : index === 0 ? (
                  <span className="absolute left-2 top-2 rounded bg-ink px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
                    Principale
                  </span>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-line p-2">
                <span className="text-xs text-muted">#{index + 1}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || uploading}
                    title="Monter"
                    className="rounded px-1.5 py-0.5 text-xs text-muted hover:bg-paper hover:text-ink disabled:opacity-40"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index === 0) return;
                      const ids = sorted.map((i) => i.id);
                      [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
                      void onReorder(ids);
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={uploading}
                    title="Supprimer"
                    className="rounded px-1.5 py-0.5 text-xs text-rose-600 hover:bg-rose-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!confirm("Supprimer cette image ?")) return;
                      void onDelete(image.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xs text-muted">Aucune image pour ce produit.</p>
      )}
    </div>
  );
}
