import type { GitError } from "@/types";
import { ErrorDetailClient } from "./client";

export async function generateStaticParams() {
  const { errors } = await import("@/data/errors");
  return errors.map((e: GitError) => ({ id: e.id }));
}

export default function Page() {
  return <ErrorDetailClient />;
}
