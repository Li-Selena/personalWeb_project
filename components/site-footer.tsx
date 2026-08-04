import Link from "next/link";
import { siteConfig } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          <strong>Li Selena</strong>
          <span aria-hidden="true"> · </span>
          Robotics Engineer
        </p>
        <nav aria-label="页脚导航">
          {siteConfig.nav.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
