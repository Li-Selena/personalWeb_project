import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageLightbox } from "@/components/image-lightbox";

export default function NotFound() {
  return (
    <main className="not-found page-shell">
      <ImageLightbox
        src="/images/assistant.jpg"
        alt="Selena 卡通小助手"
        sizes="180px"
      />
      <div>
        <p>404</p>
        <h1>这个页面暂时不在这里</h1>
        <span>可能是链接发生了变化，也可能内容还在整理中。</span>
        <Link className="button button--primary" href="/">
          <ArrowLeft aria-hidden="true" />
          返回首页
        </Link>
      </div>
    </main>
  );
}
