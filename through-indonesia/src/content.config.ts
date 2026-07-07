import { defineCollection } from "astro:content";

import { glob, file } from 'astro/loaders';

import { z } from 'astro/zod';

const workshops = defineCollection({
    loader: glob({base:'./src/content/workshops', pattern: '**/*.{md,mdx}'}),
    schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    location: z.string(),
    priceEarly: z.number(),
    priceStandard: z.number(),
    seats: z.number(),
    featured: z.boolean().default(false),
    thumbnail: image(),
    hires:image(),
    included: z.array(z.string()),
    notIncluded: z.array(z.string()),
    instructor: z.string(),
  }),
});

export const collections = {
  workshops,
};