import Image from "next/image";
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
          <div className="site-footer__filings">
            <a
              className="site-footer__icp"
              href={siteConfig.icp.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {siteConfig.icp.number}
            </a>
            <a
              className="site-footer__public-security"
              href={siteConfig.publicSecurity.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt=""
                aria-hidden="true"
                height={20}
                src={siteConfig.publicSecurity.icon}
                width={18}
              />
              <span>{siteConfig.publicSecurity.number}</span>
            </a>
          </div>
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
