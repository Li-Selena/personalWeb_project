"use client";

import { ArrowUpRight, Bookmark, Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import type { LinkItem } from "@/data/site";

type HomeBookmarksProps = {
  bookmarks: LinkItem[];
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("zh-CN");
}

export function HomeBookmarks({ bookmarks }: HomeBookmarksProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery);

  const filteredBookmarks = useMemo(() => {
    if (normalizedQuery === "") {
      return bookmarks;
    }

    return bookmarks.filter((bookmark) => {
      const searchableText = normalize(
        [bookmark.title, bookmark.description, bookmark.category, bookmark.accessNote]
          .filter(Boolean)
          .join(" "),
      );

      return searchableText.includes(normalizedQuery);
    });
  }, [bookmarks, normalizedQuery]);

  return (
    <div className="home-bookmarks">
      <label className="home-bookmarks__search">
        <Search aria-hidden="true" />
        <span className="sr-only">搜索网页收藏</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索名称、分类或用途"
        />
      </label>

      <div className="home-bookmarks__viewport" tabIndex={0} aria-label="网页收藏列表">
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((bookmark) => (
            <a
              className="home-bookmarks__item"
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              key={bookmark.title}
            >
              <span className="home-bookmarks__icon" aria-hidden="true">
                <Bookmark />
              </span>
              <span className="home-bookmarks__copy">
                <strong>{bookmark.title}</strong>
                <small>
                  {bookmark.description}
                  <span>{bookmark.category}</span>
                </small>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))
        ) : (
          <p className="home-bookmarks__empty">没有找到匹配的网页收藏</p>
        )}
      </div>
    </div>
  );
}
