import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "선녀사주",
    short_name: "선녀사주",

    description:
      "생년월일과 출생시간을 기반으로 만세력을 확인하고 선녀님의 사주풀이를 받아보세요.",

    start_url: "/",

    scope: "/",

    display: "standalone",

    background_color: "#f8f4ef",

    theme_color: "#8f70a9",

    orientation: "portrait",

    categories: [
      "lifestyle",
    ],

    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },

      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },

      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
