const R2_BASE = import.meta.env.PUBLIC_R2_URL;

import manifestJson from "../data/portfolio-manifest.json";

const manifest = manifestJson as Record<
  string,
  {
    width: number;
    height: number;
  }
>;

// console.log(import.meta.env.PUBLIC_R2_URL);

export interface GalleryImage {
  url: string;
  filename: string;
  width: number;
  height: number;
}


export interface Portfolio {
  slug: string;
  title: string;
  images: GalleryImage[];
}

export function createGalleryImages(
  folder: string,
  files: string[],
  journal = false,
): GalleryImage[] {
  return files.map((file) => {
    const dimensions = manifest[`${folder}/${file}`];

    if (journal){
      return {
      url: `${R2_BASE}/assets/article/${folder}/${file}`,
      filename: file.replace(/\.[^/.]+$/, ""),
      width: dimensions.width,
      height: dimensions.height,
    };
    } else {
      return {
      url: `${R2_BASE}/assets/portfolio/${folder}/${file}`,
      filename: file.replace(/\.[^/.]+$/, ""),
      width: dimensions.width,
      height: dimensions.height,
    };
    }
  });
}

const portfolios: Record<string, Omit<Portfolio, "slug">> = {

  bali: {
    title: "Bali",

    images: createGalleryImages("bali", [
  "bali1.webp",
  "bali2.webp",
  "bali3.webp",
  "bali4.webp",
  "bali5.webp",
])
  },
  java:{
    title: "Java",
    images: createGalleryImages("java", [
      "ijen1.webp",
      "ijen2.webp",
      "kuda1.webp",
      "kuda2.webp",
      "pantai1.webp",
      "semeru1.webp",
      "semeru2.webp",
      "semeru3.webp",
      "trawas1.webp",])
  },
  borneo: {
    title: "Borneo",
    images: createGalleryImages("borneo", [
      "simpanse1.webp",
      "orangutan1.webp",
      "orangutan2.webp",
      "orangutan3.webp",
      "buaya1.webp",])
    },
    buton: {
      title: "Buton",
      images: createGalleryImages("buton",[
        "buton6.webp",
        "buton1.webp",
        "buton2.webp",
        "buton3.webp",
        "buton4.webp",
        "buton5.webp",
        "buton7.webp"
      ])
    },
    lombok:{
      title:"Lombok",
      images:createGalleryImages("lombok",[
        "lombok1.webp",
        "lombok2.webp",
        "lombok3.webp",
        "lombok4.webp",
        "lombok5.webp",
        "lombok6.webp",
        "lombok7.webp",
      ])
    },
    sumba:{
      title: "Sumba",
      images:createGalleryImages("sumba",[
        "sumba1.webp",
        "sumba2.webp",
        "sumba3.webp",
        "sumba4.webp",
      ])
    }

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