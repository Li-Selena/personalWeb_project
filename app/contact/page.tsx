import type { Metadata } from "next";
import { CircuitFrame } from "@/components/circuit-frame";
import { ContactList } from "@/components/contact/contact-list";
import { ImageLightbox } from "@/components/image-lightbox";

export const metadata: Metadata = {
  title: "联系方式",
  description: "通过 QQ、GitHub、Gmail 或哔哩哔哩联系 Li Selena。",
};

export default function ContactPage() {
  return (
    <main>
      <section className="contact-hero page-shell" aria-labelledby="contact-title">
        <CircuitFrame className="contact-hero__circuit" />
        <div className="contact-hero__content">
          <h1 id="contact-title">联系方式</h1>
          <p>如果你想交流机器人、嵌入式、控制算法或仿真，欢迎与我联系。</p>
        </div>
        <ImageLightbox
          className="contact-hero__media"
          imageClassName="contact-hero__image"
          src="/images/contact-card.png"
          alt="Selena 紫藤花主题插画"
          priority
          sizes="(max-width: 760px) 100vw, 58vw"
        />
      </section>

      <section className="contact-content page-shell page-section" aria-label="公开联系方式">
        <ContactList />
      </section>
    </main>
  );
}
