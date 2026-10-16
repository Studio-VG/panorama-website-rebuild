import Image from "next/image";

export function StudioImage({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const unoptimized = src.endsWith(".svg") || src.startsWith("/api/");
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      style={{ objectFit: "cover" }}
    />
  );
}
