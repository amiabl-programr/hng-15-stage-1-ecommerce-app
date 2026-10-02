import Image from "next/image";
import { resolveKind, getManifestEntry } from "@/lib/products/image-manifest";
import { ProfileDiagram, type DiagramTone } from "./ProfileDiagram";

/**
 * Renders a catalogue image, falling back to the profile cross-section when
 * no photograph has been uploaded.
 *
 * Every consumer goes through here so that no component ever has to reach for
 * a fallback URL of its own.
 */

/** Minimum shape the frame needs. `ProductImage` satisfies it; the cart
 *  store only persists a URL, so the alt text is optional here. */
export interface FrameImage {
  image_url: string;
  alt_text?: string | null;
}

interface FrameProps {
  /** Slug used to look up the profile drawing and its label. */
  slug: string;
  /** Alt text for the photograph. Ignored when a drawing is shown. */
  alt: string;
  image?: FrameImage | null;
  sizes?: string;
  priority?: boolean;
  tone?: DiagramTone;
  /** Classes for the element that fills the positioned parent. */
  className?: string;
  /** Classes applied to the photograph only. */
  imageClassName?: string;
}

export function ProductImageFrame({
  slug,
  alt,
  image,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  priority = false,
  tone = "light",
  className = "",
  imageClassName = "",
}: FrameProps) {
  if (image?.image_url) {
    return (
      <Image
        src={image.image_url}
        alt={image.alt_text || alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${imageClassName} ${className}`}
      />
    );
  }

  const entry = getManifestEntry(slug);
  return <ProfileDiagram kind={entry.kind} tone={tone} className={className} />;
}

/** Same fallback logic for category tiles, which store a single image_url. */
export function CategoryImageFrame({
  slug,
  alt,
  url,
  sizes = "(max-width: 768px) 100vw, 33vw",
  tone = "dark",
  className = "",
  imageClassName = "",
}: Omit<FrameProps, "image" | "alt" | "label"> & { alt: string; url?: string | null }) {
  if (url) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className={`${imageClassName} ${className}`}
      />
    );
  }

  return <ProfileDiagram kind={resolveKind(slug).kind} tone={tone} className={className} />;
}