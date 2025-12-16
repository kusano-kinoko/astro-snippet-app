import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://kusano-kinoko.github.io",
  base: "/astro-snippet-app/",

  vite: {
    plugins: [tailwindcss()],
  },
});