"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

type ImageLightboxProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes: string;
};

export function ImageLightbox({
  src,
  alt,
  className = "",
  imageClassName = "",
  priority = false,
  sizes,
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={`image-lightbox-trigger ${className}`}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`查看原图：${alt}`}
      >
        <Image
          className={imageClassName}
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
        />
        <span className="image-lightbox-trigger__hint">
          <Maximize2 aria-hidden="true" />
          查看原图
        </span>
      </button>

      {isOpen ? (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <h2 className="sr-only" id={titleId}>
            {alt}
          </h2>
          <button
            type="button"
            className="image-lightbox__close"
            aria-label="关闭原图"
            onClick={() => setIsOpen(false)}
          >
            <X aria-hidden="true" />
          </button>
          <div className="image-lightbox__canvas">
            <Image src={src} alt={alt} fill sizes="96vw" />
          </div>
        </div>
      ) : null}
    </>
  );
}
