"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markLeadsViewed } from "./actions";

export function MarkLeadsViewed() {
  const router = useRouter();
  useEffect(() => {
    markLeadsViewed().then(() => router.refresh());
  }, [router]);
  return null;
}
