import { useState, useEffect } from "react";

interface GalleryImage {
  url: string;
  filename: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

import { responsiveImage } from "../lib/transformedImage";

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected = selectedIndex !== null ? images[selectedIndex] : null;

  const selectedOptimized = selected
    ? responsiveImage(selected.url, [800, 1200, 1600, 2000])
    : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      switch (e.key) {
        case "Escape":
          setSelectedIndex(null);
          break;

        case "ArrowLeft":
          setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
          break;

        case "ArrowRight":
          setSelectedIndex((selectedIndex + 1) % images.length);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, images.length]);

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {images.map((img, index) => {
          const optimized = responsiveImage(img.url, [400, 600, 900]);

          return (
            <button
              key={img.filename}
              onClick={() => setSelectedIndex(index)}
              className="overflow-hidden"
            >
              <img
                src={optimized.src}
                srcSet={optimized.srcset}
                sizes="(max-width: 768px) 50vw, 33vw"
                alt={img.filename}
                loading="lazy"
                decoding="async"
                className="
          w-full
          aspect-square
          object-cover
          cursor-pointer
          hover:scale-105
          transition-transform
        "
              />
            </button>
          );
        })}
      </div>

      {selected && selectedOptimized && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/90
          "
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute left-4 text-white text-5xl"
            onClick={(e) => {
              e.stopPropagation();

              setSelectedIndex(
                (selectedIndex! - 1 + images.length) % images.length,
              );
            }}
          >
            ‹
          </button>

          <img
            src={selectedOptimized.src}
            srcSet={selectedOptimized.srcset}
            sizes="100vw"
            alt={selected.filename}
            decoding="async"
            className="
              max-w-[90vw]
              max-h-[90vh]
              object-contain
            "
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 text-white text-5xl"
            onClick={(e) => {
              e.stopPropagation();

              setSelectedIndex((selectedIndex! + 1) % images.length);
            }}
          >
            ›
          </button>

          <button
            className="absolute top-4 right-4 text-white text-4xl"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
          >
            ×
          </button>

          <div className="absolute bottom-4 text-white">
            {selectedIndex! + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
