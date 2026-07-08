

import type { ImageMetadata } from "astro";


export interface GalleryImage {
  url: string;
  filename: string;
}


export interface Portfolio {
  slug: string;
  title: string;
  images: GalleryImage[];
}


function loadLocalImages(
  images: Record<string, { default: ImageMetadata }>
): GalleryImage[] {
  return Object.entries(images)
    .sort(([a], [b]) =>
      a.localeCompare(b, undefined, { numeric: true })
    )
    .map(([path, image]) => ({
      url: image.default.src,
      filename:
        path
          .split("/")
          .pop()
          ?.replace(/\.[^/.]+$/, "") ??
        "Untitled",
    }));
}


const portfolios: Record<string, Omit<Portfolio, "slug">> = {

  antarctica: {
    title: "Antarctica",

    images: loadLocalImages(
      import.meta.glob(
        "../assets/portfolio/antarcticapage/*.{png,jpg,jpeg,webp}",
        {
          eager: true,
        }
      )
    ),
  },


  pakistan: {
    title: "Pakistan",

    images: loadLocalImages(
      import.meta.glob(
        "../assets/portfolio/pakistanpage/*.{png,jpg,jpeg,webp}",
        {
          eager: true,
        }
      )
    ),
  },


  indonesia: {
    title: "Indonesia",

    images: loadLocalImages(
      import.meta.glob(
        "../assets/portfolio/indonesiapage/*.{png,jpg,jpeg,webp}",
        {
          eager: true,
        }
      )
    ),
  },

};



export function getPortfolio(
  slug: string
): Portfolio | null {

  const item = portfolios[slug];

  if (!item) return null;

  return {
    slug,
    title: item.title,
    images: item.images,
  };
}


export function getAllPortfolios() {
  return Object.entries(portfolios).map(
    ([slug, data]) => ({
      slug,
      title: data.title,
      thumbnail: data.images[0],
    })
  );
}