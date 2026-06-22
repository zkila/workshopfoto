import type { ImageMetadata } from "astro";

export interface Portfolio {
  slug: string;
  title: string;
  images: ImageMetadata[];
}


const portfolios: Record<string, Omit<Portfolio, "slug">> = {
  antarctica: {
    title: "Antarctica",

    images: Object.values(
      import.meta.glob<ImageMetadata>(
        "../assets/portfolio/antarcticapage/*.{png,jpg,jpeg,webp}",
        {
          eager: true,
          import: "default",
        }
      )
    ),
  },

pakistan: {
    title: "Pakistan",

    images: Object.values(
      import.meta.glob<ImageMetadata>(
        "../assets/portfolio/pakistanpage/*.{png,jpg,jpeg,webp}",
        {
          eager: true,
          import: "default",
        }
      )
    ),
  },

  indonesia: {
    title: "Indonesia",

    images: Object.values(
      import.meta.glob<ImageMetadata>(
        "../assets/portfolio/indonesiapage/*.{png,jpg,jpeg,webp}",
        {
          eager: true,
          import: "default",
        }
      )
    ),
  },
};


export function getPortfolio(slug: string): Portfolio | null {
  const item = portfolios[slug];

  if (!item) return null;

  return {
    slug,
    title: item.title,
    images: item.images,
  };
}


export function getAllPortfolios() {
  return Object.entries(portfolios).map(([slug, data]) => ({
    slug,
    title: data.title,
    images: data.images,
  }));
}