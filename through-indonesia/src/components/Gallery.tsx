import { useState, useEffect } from "react";
import type { ImageMetadata } from "astro";

interface GalleryProps {
  images: ImageMetadata[];
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected = selectedIndex !== null ? images[selectedIndex] : null;

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
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="overflow-hidden"
          >
            <img
              src={img.src}
              alt={`Image ${index + 1}`}
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
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
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
            src={selected.src}
            alt={`Image ${selectedIndex! + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
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

          {/* Counter */}
          <div className="absolute bottom-4 text-white">
            {selectedIndex! + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
