"use client";

import React from "react";

import { Typography } from "@components/typography";
import { UploadImageModal } from "./upload-image-modal";
import { Progress } from "@components/ui/progress";

import useWikiController from "./use-wiki-controller";
import WikiCard from "@components/wiki-card";

export function WikiComponent() {
  const { wikis, isLoadingWikis, progress } = useWikiController();
  return (
    <section className="space-y-8">
      <section className="flex items-center justify-between">
        <Typography variant="h2" className="text-primary">
          Wiki Page
        </Typography>
        <Progress value={progress} className="w-[60%]" />
        <UploadImageModal />
      </section>
      <section className="py-10">
        {isLoadingWikis ? (
          <></>
        ) : (
          <ul className="masonry sm:masonry-sm md:masonry-md">
            {wikis?.map((wiki) => (
              <li key={wiki.id} className="p-4">
                <WikiCard wiki={wiki} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
