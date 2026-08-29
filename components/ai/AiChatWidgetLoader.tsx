"use client";

import dynamic from "next/dynamic";

export const AiChatWidget = dynamic(
  () => import("./AiChatWidget").then((mod) => mod.AiChatWidget),
  { ssr: false }
);
