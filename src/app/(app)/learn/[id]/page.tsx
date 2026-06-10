import type { Article } from "@/types";
import { ArticleDetailClient } from "./client";

export async function generateStaticParams() {
  const { articles } = await import("@/data/articles");
  return articles.map((a: Article) => ({ id: a.id }));
}

export default function Page() {
  return <ArticleDetailClient />;
}
