import Link from "next/link";
import { siteConfig } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__identity">
          <p>
            <strong>Li Selena</strong>
            <span aria-hidden="true"> · </span>
            Robotics Engineer
          </p>
          <a
            className="site-footer__icp"
            href={siteConfig.icp.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {siteConfig.icp.number}
          </a>
        </div>
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
