"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProjectModalProps {
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  image: string;
  appImages?: string[];
  liveUrl?: string;
  githubUrl?: string;
  onClose: () => void;
}

export default function ProjectModal({
  title,
  description,
  longDescription,
  tags,
  image,
  appImages = [],
  liveUrl,
  githubUrl,
  onClose,
}: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? appImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === appImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-black/70 h-dvh">
      <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex sticky top-0 justify-between items-center p-6 border-b bg-card border-border">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Image */}
          <div className="overflow-hidden h-64 rounded-lg bg-background">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">About</h3>
            <p className="leading-relaxed text-muted-foreground">
              {longDescription || description}
            </p>
          </div>

          {/* App Images Gallery - Only shown if appImages exist */}
          {appImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                App Showcase
              </h3>
              <div className="relative">
                {/* Main Image Viewer */}
                <div className="flex overflow-hidden relative justify-center items-center h-96 rounded-lg bg-background">
                  <img
                    src={appImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`${title} screenshot ${currentImageIndex + 1}`}
                    className="object-contain w-full h-full"
                  />

                  {/* Navigation Buttons */}
                  {appImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 p-2 text-white rounded-full transition-colors -translate-y-1/2 bg-black/50 hover:bg-black/70"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 p-2 text-white rounded-full transition-colors -translate-y-1/2 bg-black/50 hover:bg-black/70"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                <div className="flex overflow-x-auto gap-2 pb-2 mt-4">
                  {appImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-24 rounded-md overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Thumbnail ${idx + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>

                {/* Image Counter */}
                <div className="mt-3 text-sm text-center text-muted-foreground">
                  {currentImageIndex + 1} / {appImages.length}
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-semibold rounded-full text-primary bg-primary/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-4 border-t border-border">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 font-semibold text-black rounded-lg transition-colors bg-primary hover:bg-primary/90"
              >
                Visit Live Site
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 font-semibold rounded-lg border transition-colors border-border text-foreground hover:bg-border"
              >
                View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
