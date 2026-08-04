import type { Metadata } from "next";
import { ArrowRight, BookOpenText, CheckCircle2, Cpu, Network, Orbit } from "lucide-react";
import { CircuitFrame } from "@/components/circuit-frame";
import { FocusList } from "@/components/focus-list";
import { ImageLightbox } from "@/components/image-lightbox";
import { SectionTitle } from "@/components/section-title";
import { expandingAreas, wikiCategories } from "@/data/site";

export const metadata: Metadata = {
  title: "关于我",
  description: "认识机器人工程师 Li Selena，以及当前关注和持续拓展的技术方向。",
};

const expansionIcons = [Network, Orbit, Cpu];

export default function AboutPage() {
  return (
    <main>
      <section className="about-hero page-shell" aria-labelledby="about-title">
        <CircuitFrame className="about-hero__circuit" />
        <div className="about-hero__content">
          <h1 id="about-title">关于我</h1>
          <p className="about-hero__lead">专注于机器人、嵌入式系统、运动控制与算法。</p>
          <p>
            你好，我是 Li Selena，一名机器人工程师。目前主要关注嵌入式开发、机器人运动控制和控制算法，也在持续学习新知识，逐步拓展自己的技术栈。
          </p>
          <p>
            这个网站既是我的个人学习档案，也是日常使用的快捷入口。我会在这里整理学习笔记、踩坑记录、环境搭建过程和实用链接。
          </p>
        </div>
        <ImageLightbox
          className="about-hero__media"
          imageClassName="about-hero__image"
          src="/images/about-flower.png"
          alt="Selena 捧花主题插画"
          priority
          sizes="(max-width: 760px) 100vw, 58vw"
        />
      </section>

      <section className="about-grid page-shell page-section">
        <div aria-labelledby="skills-title">
          <SectionTitle>
            <span id="skills-title">当前关注</span>
          </SectionTitle>
          <FocusList />
        </div>

        <div aria-labelledby="expanding-title">
          <SectionTitle>
            <span id="expanding-title">正在拓展</span>
          </SectionTitle>
          <div className="expansion-list">
            {expandingAreas.map((area, index) => {
              const Icon = expansionIcons[index];
              return (
                <article className="expansion-list__item" key={area.title}>
                  <span className="expansion-list__marker" aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h2>{area.title}</h2>
                    <p>{area.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="learning-roadmap page-shell page-section" aria-labelledby="roadmap-title">
        <SectionTitle>
          <span id="roadmap-title">近期学习方向</span>
        </SectionTitle>
        <div className="learning-roadmap__list">
          {wikiCategories.map((category, index) => (
            <div className="learning-roadmap__row" key={category.slug}>
              <span className="learning-roadmap__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <BookOpenText aria-hidden="true" />
              <strong>{category.name}</strong>
              <span>随学习进度持续整理</span>
              <CheckCircle2 aria-hidden="true" />
              <ArrowRight aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
