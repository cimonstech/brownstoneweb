"use client";

import dynamic from "next/dynamic";

const ExitIntent = dynamic(() => import("./ExitIntent"), { ssr: false });

export default function ExitIntentDynamic() {
  return <ExitIntent />;
}
