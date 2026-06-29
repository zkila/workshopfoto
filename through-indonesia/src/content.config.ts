import { defineCollection } from "astro:content";

import { glob, file } from 'astro/loaders';

import { z } from 'astro/zod';

const workshops = defineCollection({
    loader: glob({base:'./src/content/workshops', pattern: '**/*.{md,mdx}'}),
    schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    location: z.string(),
    price: z.number(),
    seats: z.number(),
    featured: z.boolean().default(false),
    thumbnail: z.string(),
    hires:z.string().optional(),
    registrationLink: z.string().optional(),
    included: z.array(z.string()),
    notIncluded: z.array(z.string()),
  }),
});

export const collections = {
  workshops,
};