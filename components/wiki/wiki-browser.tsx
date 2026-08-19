"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  Bookmark,
  Box,
  Cpu,
  FileText,
  Filter,
  Search,
  Wrench,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { ImageLightbox } from "@/components/image-lightbox";
import type { LinkItem } from "@/data/site";
import type { WikiEntryMeta } from "@/lib/wiki";

type WikiBrowserProps = {
  entries: WikiEntryMeta[];
  categories: ReadonlyArray<{ name: string; slug: string }>;
  bookmarks: LinkItem[];
  tools: LinkItem[];
};

type Tab = "notes" | "bookmarks" | "tools";

const tabs: Array<{ id: Tab; label: string; icon: typeof FileText }> = [
  { id: "notes", label: "技术笔记", icon: FileText },
  { id: "bookmarks", label: "网站收藏", icon: Bookmark },
  { id: "tools", label: "网页工具", icon: Wrench },
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("zh-CN");
}

export function WikiBrowser({ entries, categories, bookmarks, tools }: WikiBrowserProps) {
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesCategory = category === "all" || entry.category === category;
      const haystack = normalize(
        [entry.title, entry.summary, entry.category, ...entry.tags].join(" "),
      );
      return matchesCategory && (normalizedQuery === "" || haystack.includes(normalizedQuery));
    });
  }, [category, entries, normalizedQuery]);

  const filteredLinks = useMemo(() => {
    const source = activeTab === "bookmarks" ? bookmarks : tools;
    return source.filter((item) => {
      const haystack = normalize([item.title, item.description, item.category].join(" "));
      return normalizedQuery === "" || haystack.includes(normalizedQuery);
    });
  }, [activeTab, bookmarks, normalizedQuery, tools]);

  return (
    <div className="wiki-browser">
      <div className="wiki-tabs" role="tablist" aria-label="Wiki 内容类型">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`wiki-tabs__button ${active ? "is-active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                setCategory("all");
              }}
            >
              <Icon aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="wiki-controls">
        <label className="wiki-search">
          <Search aria-hidden="true" />
          <span className="sr-only">搜索 Wiki、网站和工具</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索 Wiki、网站和工具"
            type="search"
          />
        </label>
        {activeTab === "notes" ? (
          <label className="wiki-mobile-filter">
            <Filter aria-hidden="true" />
            <span className="sr-only">选择分类</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">全部分类</option>
              {categories.map((item) => (
                <option value={item.name} key={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="wiki-layout">
        <aside className="wiki-categories" aria-label="Wiki 分类">
          <h2>分类</h2>
          <button
            type="button"
            className={category === "all" ? "is-active" : ""}
            onClick={() => setCategory("all")}
            disabled={activeTab !== "notes"}
          >
            <Box aria-hidden="true" />
            全部内容
            <span>{entries.length}</span>
          </button>
          {categories.map((item) => {
            const count = entries.filter((entry) => entry.category === item.name).length;
            return (
              <button
                type="button"
                className={category === item.name ? "is-active" : ""}
                onClick={() => setCategory(item.name)}
                disabled={activeTab !== "notes"}
                key={item.slug}
              >
                <Cpu aria-hidden="true" />
                {item.name}
                <span>{count}</span>
              </button>
            );
          })}
        </aside>

        <section className="wiki-results" aria-live="polite">
          <div className="wiki-results__heading">
            <span>标题</span>
            <span>分类</span>
            <span>最近更新</span>
          </div>

          {activeTab === "notes" ? (
            filteredEntries.length > 0 ? (
              <div className="wiki-entry-list">
                {filteredEntries.map((entry) => (
                  <Link
                    className="wiki-entry-row"
                    href={`/wiki/${entry.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={entry.slug}
                  >
                    <span className="wiki-entry-row__icon" aria-hidden="true">
                      <BookOpenText />
                    </span>
                    <span className="wiki-entry-row__main">
                      <strong>{entry.title}</strong>
                      <small>{entry.summary}</small>
                      <span className="tag-list">
                        {entry.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </span>
                    </span>
                    <span>{entry.category}</span>
                    <time dateTime={entry.updatedAt}>{entry.updatedAt}</time>
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : (
              <WikiEmptyState hasQuery={normalizedQuery !== "" || category !== "all"} />
            )
          ) : filteredLinks.length > 0 ? (
            <div className="wiki-link-list">
              {filteredLinks.map((item) => (
                <a
                  className="wiki-link-row"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={item.title}
                >
                  <span className="wiki-entry-row__icon" aria-hidden="true">
                    {activeTab === "bookmarks" ? <Bookmark /> : <Wrench />}
                  </span>
                  <span className="wiki-entry-row__main">
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                    {item.accessNote ? <em>{item.accessNote}</em> : null}
                  </span>
                  <span>{item.category}</span>
                  <span>外部链接</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : (
            <WikiEmptyState hasQuery />
          )}
        </section>

        <aside className="wiki-sidebar">
          <SidebarLinks title="常用工具" items={tools.slice(0, 4)} icon="tool" />
          <SidebarLinks title="网站收藏" items={bookmarks.slice(0, 3)} icon="bookmark" />
          <div className="wiki-assistant">
            <p>
              <strong>需要找点什么？</strong>
              试试搜索或切换分类吧。
            </p>
            <ImageLightbox
              src="/images/assistant.jpg"
              alt="Selena 卡通小助手"
              sizes="120px"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function WikiEmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="wiki-empty-state">
      <ImageLightbox
        src="/images/assistant.jpg"
        alt="Selena 卡通小助手"
        priority
        sizes="160px"
      />
      <div>
        <h2>{hasQuery ? "没有找到匹配内容" : "这里还在慢慢施工中"}</h2>
        <p>
          {hasQuery
            ? "换个关键词，或返回全部分类再试试。"
            : "新的学习笔记整理好后，就会陆续出现在这里。"}
        </p>
      </div>
    </div>
  );
}

function SidebarLinks({
  title,
  items,
  icon,
}: {
  title: string;
  items: LinkItem[];
  icon: "tool" | "bookmark";
}) {
  return (
    <section className="wiki-sidebar__panel">
      <h2>{title}</h2>
      {items.map((item) => (
        <a href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}>
          {icon === "tool" ? <Wrench aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
          <span>{item.title}</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      ))}
    </section>
  );
}
