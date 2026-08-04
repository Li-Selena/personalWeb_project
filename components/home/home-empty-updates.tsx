import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export function HomeEmptyUpdates() {
  return (
    <div className="home-empty-updates">
      <span className="home-empty-updates__icon" aria-hidden="true">
        <FileText />
      </span>
      <div>
        <strong>学习笔记正在整理中</strong>
        <p>第一篇内容发布后，会自动出现在这里。</p>
      </div>
      <Link href="/wiki/">
        前往 Wiki
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}
