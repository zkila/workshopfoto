import type { ImageMetadata } from "astro";

export interface GalleryImage {
  url: string;
  filename: string;
}


export function loadLocalGallery(
  globResult: Record<string, { default: ImageMetadata }>
): GalleryImage[] {
  return Object.entries(globResult)
    .sort(([a], [b]) =>
      a.localeCompare(b, undefined, { numeric: true })
    )
    .map(([path, module]) => ({
      url: module.default.src,
      filename:
        path.split("/").pop()?.replace(/\.[^/.]+$/, "") ??
        "Untitled",
    }));
}


export function loadRemoteGallery(
  images: string[]
): GalleryImage[] {
  return images.map((url) => ({
    url,
    filename:
      url
        .split("/")
        .pop()
        ?.replace(/\.[^/.]+$/, "") ??
      "Untitled",
  }));
}