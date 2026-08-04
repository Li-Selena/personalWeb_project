import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { CodeCopyEnhancer } from "@/components/wiki/code-copy-enhancer";
import { getWikiEntries, getWikiEntry } from "@/lib/wiki";

export const dynamicParams = false;

type WikiArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const entries = getWikiEntries();

  // Next.js static export requires at least one generated value for a dynamic
  // route. This private fallback renders the normal 404 page while the Wiki is
  // intentionally empty, and disappears from the generated params once an
  // article is added.
  return entries.length > 0
    ? entries.map((entry) => ({ slug: entry.slug }))
    : [{ slug: "_empty" }];
}

export async function generateMetadata({ params }: WikiArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getWikiEntry(slug);

  if (!entry) {
    return {
      title: "内容未找到",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: entry.title,
    description: entry.summary,
  };
}

export default async function WikiArticlePage({ params }: WikiArticlePageProps) {
  const { slug } = await params;
  const entry = await getWikiEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <main className="article-page page-shell">
      <Link className="article-page__back" href="/wiki/">
        <ArrowLeft aria-hidden="true" />
        返回 Wiki
      </Link>
      <header className="article-header">
        <p>{entry.category}</p>
        <h1>{entry.title}</h1>
        <span>{entry.summary}</span>
        <div>
          <CalendarDays aria-hidden="true" />
          更新于 <time dateTime={entry.updatedAt}>{entry.updatedAt}</time>
        </div>
        <ul className="tag-list" aria-label="文章标签">
          {entry.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </header>
      <div className={`article-content-layout ${entry.toc.length === 0 ? "article-content-layout--plain" : ""}`}>
        <div data-article-root>
          <CodeCopyEnhancer />
          <article className="markdown-body" dangerouslySetInnerHTML={{ __html: entry.html }} />
        </div>
        {entry.toc.length > 0 ? (
          <aside className="article-toc" aria-label="本文目录">
            <strong>本文目录</strong>
            <ol>
              {entry.toc.map((item) => (
                <li className={item.level === 3 ? "is-nested" : ""} key={item.id}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ol>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
