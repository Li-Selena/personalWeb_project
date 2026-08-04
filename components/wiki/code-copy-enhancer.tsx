"use client";

import { useEffect } from "react";

export function CodeCopyEnhancer() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-article-root]");
    if (!root) {
      return;
    }

    const buttons = Array.from(root.querySelectorAll("pre")).map((pre) => {
      const code = pre.querySelector("code");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy-button";
      button.textContent = "复制";
      button.setAttribute("aria-label", "复制代码");

      const copyCode = async () => {
        await navigator.clipboard.writeText(code?.textContent ?? pre.textContent ?? "");
        button.textContent = "已复制";
        window.setTimeout(() => {
          button.textContent = "复制";
        }, 1600);
      };

      button.addEventListener("click", copyCode);
      pre.append(button);
      return { button, copyCode };
    });

    return () => {
      buttons.forEach(({ button, copyCode }) => {
        button.removeEventListener("click", copyCode);
        button.remove();
      });
    };
  }, []);

  return null;
}
