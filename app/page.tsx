import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Box, Cloud, Languages, Mail, Wrench } from "lucide-react";
import { CircuitFrame } from "@/components/circuit-frame";
import { FocusList } from "@/components/focus-list";
import { HomeBookmarks } from "@/components/home/home-bookmarks";
import { HomeEmptyUpdates } from "@/components/home/home-empty-updates";
import { ImageLightbox } from "@/components/image-lightbox";
import { SectionTitle } from "@/components/section-title";
import { bookmarks, tools } from "@/data/site";
import { getWikiEntries } from "@/lib/wiki";

export const metadata: Metadata = {
  title: "首页",
  description: "Li Selena 的个人学习记录与日常工具站。",
};

const toolIcons = [Languages, Languages, Cloud, Mail, Wrench];

export default function HomePage() {
  const entries = getWikiEntries();
  const recentEntries = entries.slice(0, 4);

  return (
    <main>
      <section className="home-hero page-shell" aria-labelledby="home-title">
        <CircuitFrame className="home-hero__circuit" />
        <div className="home-hero__content">
          <h1 id="home-title">Li Selena</h1>
          <p className="home-hero__role">机器人工程师</p>
          <p className="home-hero__focus">嵌入式 · 运动控制 · 控制算法</p>
          <p className="home-hero__intro">
            记录学习过程，整理技术笔记，也收好每天都会用到的网站和工具。
          </p>
          <div className="home-hero__actions">
            <Link className="button button--primary" href="/about/">
              关于我
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button button--secondary" href="/wiki/">
              进入 Wiki
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <ImageLightbox
          className="home-hero__media"
          imageClassName="home-hero__image"
          src="/images/home-summer.jpg"
          alt="Selena 夏日城市主题插画"
          priority
          sizes="(max-width: 760px) 100vw, 62vw"
        />
      </section>

      <section className="home-focus page-shell page-section" aria-labelledby="focus-title">
        <SectionTitle>
          <span id="focus-title">专业方向</span>
        </SectionTitle>
        <FocusList compact />
      </section>

      <section className="home-dashboard page-shell page-section">
        <div className="home-dashboard__updates" aria-labelledby="updates-title">
          <SectionTitle
            action={
              <Link className="text-link" href="/wiki/">
                查看全部
                <ArrowRight aria-hidden="true" />
              </Link>
            }
          >
            <span id="updates-title">最近更新</span>
          </SectionTitle>
          {recentEntries.length === 0 ? (
            <HomeEmptyUpdates />
          ) : (
            <ul className="recent-list">
              {recentEntries.map((entry) => (
                <li key={entry.slug}>
                  <FileIcon />
                  <Link href={`/wiki/${entry.slug}/`}>{entry.title}</Link>
                  <span>{entry.updatedAt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="home-dashboard__resources">
          <section className="home-dashboard__bookmarks" aria-labelledby="bookmarks-title">
            <SectionTitle
              action={
                <Link className="text-link" href="/wiki/">
                  查看全部
                  <ArrowRight aria-hidden="true" />
                </Link>
              }
            >
              <span id="bookmarks-title">网页收藏</span>
            </SectionTitle>
            <HomeBookmarks bookmarks={bookmarks} />
          </section>

          <section className="home-dashboard__tools" aria-labelledby="tools-title">
            <SectionTitle
              action={
                <Link className="text-link" href="/wiki/">
                  查看全部
                  <ArrowRight aria-hidden="true" />
                </Link>
              }
            >
              <span id="tools-title">常用工具</span>
            </SectionTitle>
            <div className="tool-strip">
              {tools.slice(0, 8).map((tool, index) => {
                const Icon = toolIcons[index] ?? Box;
                return (
                  <a
                    className="tool-strip__item"
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={tool.title}
                  >
                    <span className="tool-strip__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <strong>{tool.title}</strong>
                    <small>{tool.description}</small>
                    <ArrowRight className="tool-strip__arrow" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function FileIcon() {
  return <Box aria-hidden="true" />;
}
