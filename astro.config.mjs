// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    mdx(),
  ],

  adapter: cloudflare(),
  output: "server",
});


export const colors = {
  background: "#0F0F0F",
  surface: "#181818",
  text: "#FFFFFF",
  textMuted: "#A0A0A0",
  accent: "#D4AF37",
};