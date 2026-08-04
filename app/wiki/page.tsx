import type { Metadata } from "next";
import { CircuitFrame } from "@/components/circuit-frame";
import { WikiBrowser } from "@/components/wiki/wiki-browser";
import { bookmarks, tools, wikiCategories } from "@/data/site";
import { getWikiEntries } from "@/lib/wiki";

export const metadata: Metadata = {
  title: "Wiki",
  description: "浏览 Li Selena 的技术笔记、网站收藏和常用网页工具。",
};

export default function WikiPage() {
  const entries = getWikiEntries();

  return (
    <main className="wiki-page">
      <section className="wiki-heading page-shell" aria-labelledby="wiki-title">
        <CircuitFrame />
        <h1 id="wiki-title">Wiki</h1>
        <p>学习笔记、网站收藏和常用工具，都整理在这里。</p>
      </section>
      <div className="page-shell">
        <WikiBrowser
          entries={entries}
          categories={wikiCategories}
          bookmarks={bookmarks}
          tools={tools}
        />
      </div>
    </main>
  );
}
