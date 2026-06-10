import type { CheatSheet } from "@/types";
import { CheatSheetDetailClient } from "./client";

export async function generateStaticParams() {
  const { cheatsheets } = await import("@/data/cheatsheets");
  return cheatsheets.map((c: CheatSheet) => ({ id: c.id }));
}

export default function Page() {
  return <CheatSheetDetailClient />;
}
