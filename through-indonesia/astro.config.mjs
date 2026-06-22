// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';


import react from "@astrojs/react";


// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});

export const colors = {
  background: "#0F0F0F",
  surface: "#181818",
  text: "#FFFFFF",
  textMuted: "#A0A0A0",
  accent: "#D4AF37"
};