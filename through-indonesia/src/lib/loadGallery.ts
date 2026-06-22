import type { ImageMetadata } from "astro";

export function loadGallery(
  globResult: Record<string, { default: ImageMetadata }>
) {
  return Object.entries(globResult)
    .sort(([a], [b]) =>
      a.localeCompare(b, undefined, { numeric: true })
    )
    .map(([path, module]) => ({
      image: module.default,
      filename:
        path.split("/").pop()?.replace(/\.[^/.]+$/, "") ??
        "Untitled",
    }));
}