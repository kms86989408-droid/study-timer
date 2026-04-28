import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "study-timer",
    short_name: "study-timer",
    description: "공부와 휴식 시간을 5분 단위로 기록하는 개인용 타이머",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: "#28604f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
