import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "Shindo Client CDN",
      htmlAttrs: { lang: "en-US" },
      meta: [
        {
          name: "description",
          content:
            "Official CDN infrastructure for distributing the Shindo Client.",
        },
        { name: "robots", content: "noindex, nofollow" },
        { name: "theme-color", content: "#8539ff" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  routeRules: {
    "/**": { prerender: true },
  },
  compatibilityDate: "2025-11-10",
});
