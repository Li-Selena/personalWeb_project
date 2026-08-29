import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import rehypeHighlight from "rehype-highlight";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

const WIKI_DIRECTORY = path.join(process.cwd(), "content", "wiki");
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type WikiEntryMeta = {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  createdAt: string;
  updatedAt: string;
};

export type WikiEntry = WikiEntryMeta & {
  content: string;
  html: string;
  toc: Array<{
    id: string;
    text: string;
    level: 2 | 3;
  }>;
};

type FrontMatter = Partial<Omit<WikiEntryMeta, "createdAt" | "updatedAt">> & {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  draft?: boolean;
};

type MarkdownNode = {
  type: string;
  depth?: number;
  value?: string;
  children?: MarkdownNode[];
};

type HtmlNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  value?: string;
  children?: HtmlNode[];
};

const LOCAL_VIDEO_PATTERN = /^\/[^?#]+\.(?:mp4|webm|ogg)(?:[?#].*)?$/i;
const LOCAL_IMAGE_PATTERN = /^\/[^?#]+\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;

function markdownText(node: MarkdownNode): string {
  if (typeof node.value === "string") {
    return node.value;
  }

  return node.children?.map(markdownText).join("") ?? "";
}

function buildTableOfContents(content: string): WikiEntry["toc"] {
  const tree = unified().use(remarkParse).parse(content) as MarkdownNode;
  const slugger = new GithubSlugger();

  return (tree.children ?? []).flatMap((node) => {
    if (node.type !== "heading" || (node.depth !== 2 && node.depth !== 3)) {
      return [];
    }

    const text = markdownText(node).trim();
    return text ? [{ id: `user-content-${slugger.slug(text)}`, text, level: node.depth }] : [];
  });
}

function rehypeLinkImages() {
  return (tree: HtmlNode) => {
    function walk(node: HtmlNode) {
      if (!node.children) {
        return;
      }

      node.children = node.children.map((child) => {
        if (child.type === "element" && child.tagName === "img") {
          const src = child.properties?.src;
          if (typeof src === "string") {
            return {
              type: "element",
              tagName: "a",
              properties: {
                href: src,
                target: "_blank",
                rel: ["noopener", "noreferrer"],
                className: ["markdown-image-link"],
              },
              children: [child],
            };
          }
        }

        walk(child);
        return child;
      });
    }

    walk(tree);
  };
}

function rehypeLinkVideos() {
  return (tree: HtmlNode) => {
    function videoFigure(link: HtmlNode): HtmlNode | null {
      if (link.type !== "element" || link.tagName !== "a") {
        return null;
      }

      const href = link.properties?.href;
      const title = link.properties?.title;
      if (typeof href !== "string" || !LOCAL_VIDEO_PATTERN.test(href)) {
        return null;
      }

      const poster =
        typeof title === "string" && LOCAL_IMAGE_PATTERN.test(title) ? title : undefined;
      const caption =
        link.children && link.children.length > 0
          ? link.children
          : [{ type: "text", value: "仿真演示视频" }];

      return {
        type: "element",
        tagName: "figure",
        properties: { className: ["markdown-video-figure"] },
        children: [
          {
            type: "element",
            tagName: "video",
            properties: {
              controls: true,
              playsInline: true,
              preload: "metadata",
              src: href,
              ...(poster ? { poster } : {}),
            },
            children: [
              {
                type: "element",
                tagName: "a",
                properties: { href },
                children: [{ type: "text", value: "下载或打开视频" }],
              },
            ],
          },
          {
            type: "element",
            tagName: "figcaption",
            properties: {},
            children: caption,
          },
        ],
      };
    }

    function walk(node: HtmlNode) {
      if (!node.children) {
        return;
      }

      node.children = node.children.map((child) => {
        if (child.type === "element" && child.tagName === "p" && child.children?.length === 1) {
          const figure = videoFigure(child.children[0]);
          if (figure) {
            return figure;
          }
        }

        const figure = videoFigure(child);
        if (figure) {
          return figure;
        }

        walk(child);
        return child;
      });
    }

    walk(tree);
  };
}

function rehypeExternalLinks() {
  return (tree: HtmlNode) => {
    function walk(node: HtmlNode) {
      if (node.type === "element" && node.tagName === "a") {
        const href = node.properties?.href;

        if (typeof href === "string" && /^https?:\/\//i.test(href)) {
          node.properties = {
            ...node.properties,
            target: "_blank",
            rel: ["noopener", "noreferrer"],
          };
        }
      }

      node.children?.forEach(walk);
    }

    walk(tree);
  };
}

function walkMarkdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walkMarkdownFiles(absolutePath);
    }

    if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name.startsWith("_")) {
      return [];
    }

    return [absolutePath];
  });
}

function normalizeDate(value: string | Date | undefined): string | null {
  if (typeof value === "string" && DATE_PATTERN.test(value)) {
    return value;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return null;
}

function parseMetadata(filePath: string): { meta: WikiEntryMeta; content: string } | null {
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const frontMatter = data as FrontMatter;

  if (frontMatter.draft === true) {
    return null;
  }

  const requiredStringFields: Array<keyof WikiEntryMeta> = [
    "title",
    "slug",
    "category",
    "summary",
  ];

  for (const field of requiredStringFields) {
    if (typeof frontMatter[field] !== "string" || frontMatter[field]?.trim() === "") {
      throw new Error(`${filePath}: Front Matter 缺少字段 ${field}`);
    }
  }

  const createdAt = normalizeDate(frontMatter.createdAt);
  const updatedAt = normalizeDate(frontMatter.updatedAt);

  if (!createdAt || !updatedAt) {
    throw new Error(`${filePath}: createdAt 或 updatedAt 必须使用 YYYY-MM-DD`);
  }

  if (!Array.isArray(frontMatter.tags) || !frontMatter.tags.every((tag) => typeof tag === "string")) {
    throw new Error(`${filePath}: tags 必须是字符串数组`);
  }

  return {
    meta: {
      title: frontMatter.title!,
      slug: frontMatter.slug!,
      category: frontMatter.category!,
      tags: frontMatter.tags,
      summary: frontMatter.summary!,
      createdAt,
      updatedAt,
    },
    content,
  };
}

export function getWikiEntries(): WikiEntryMeta[] {
  const entries = walkMarkdownFiles(WIKI_DIRECTORY)
    .map((filePath) => parseMetadata(filePath))
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .map(({ meta }) => meta)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const slugs = new Set<string>();
  for (const entry of entries) {
    if (slugs.has(entry.slug)) {
      throw new Error(`检测到重复 Wiki slug: ${entry.slug}`);
    }
    slugs.add(entry.slug);
  }

  return entries;
}

export async function getWikiEntry(slug: string): Promise<WikiEntry | null> {
  for (const filePath of walkMarkdownFiles(WIKI_DIRECTORY)) {
    const parsed = parseMetadata(filePath);
    if (parsed?.meta.slug !== slug) {
      continue;
    }

    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeSanitize)
      .use(rehypeLinkImages)
      .use(rehypeLinkVideos)
      .use(rehypeExternalLinks)
      .use(rehypeHighlight, { detect: true })
      .use(rehypeStringify)
      .process(parsed.content);

    return {
      ...parsed.meta,
      content: parsed.content,
      html: String(result),
      toc: buildTableOfContents(parsed.content),
    };
  }

  return null;
}
