'use client'

import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface ProjectModalProps {
  title: string
  description: string
  longDescription?: string
  tags: string[]
  image: string
  appImages?: string[]
  liveUrl?: string
  githubUrl?: string
  onClose: () => void
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? appImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === appImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fixed inset-0 z-50 flex h-dvh items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="bg-card max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg">
        {/* Header */}
        <div className="bg-card border-border sticky top-0 flex items-center justify-between border-b p-6">
          <h2 className="text-foreground text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Main Image */}
          <div className="bg-background h-64 overflow-hidden rounded-lg">
            <img
              src={image || '/placeholder.svg'}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-foreground text-lg font-semibold">About</h3>
            <p className="text-muted-foreground leading-relaxed">
              {longDescription || description}
            </p>
          </div>

          {/* App Images Gallery - Only shown if appImages exist */}
          {appImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-foreground text-lg font-semibold">App Showcase</h3>
              <div className="relative">
                {/* Main Image Viewer */}
                <div className="bg-background relative flex h-96 items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={appImages[currentImageIndex] || '/placeholder.svg'}
                    alt={`${title} screenshot ${currentImageIndex + 1}`}
                    className="h-full w-full object-contain"
                  />

                  {/* Navigation Buttons */}
                  {appImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {appImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-24 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                        idx === currentImageIndex
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img || '/placeholder.svg'}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Image Counter */}
                <div className="text-muted-foreground mt-3 text-center text-sm">
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
                className="text-primary bg-primary/10 rounded-full px-3 py-1 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="border-border flex gap-4 border-t pt-4">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 font-semibold text-black transition-colors"
              >
                Visit Live Site
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="border-border text-foreground hover:bg-border rounded-lg border px-4 py-2 font-semibold transition-colors"
              >
                View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
