import type { CommandRecipe } from "@/types";
import { CommandDetailClient } from "./client";

export async function generateStaticParams() {
  const { commands } = await import("@/data/commands");
  return commands.map((c: CommandRecipe) => ({ id: c.id }));
}

export default function Page() {
  return <CommandDetailClient />;
}
