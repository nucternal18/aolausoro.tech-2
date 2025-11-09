"use client";

import React from "react";

import { Typography } from "@components/Typography";
import { UploadImageModal } from "./upload-image-modal";
import { Progress } from "@components/ui/progress";

import useWikiController from "./use-wiki-controller";
import WikiCard from "@components/wiki-card";
import type { PartialWikiProps } from "@src/entities/models/Wiki";

export function WikiComponent({ wikis }: { wikis: PartialWikiProps[] }) {
  const { progress } = useWikiController();
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
        {Array.isArray(wikis) && wikis.length > 0 ? (
          <ul className="masonry sm:masonry-sm md:masonry-md">
            {wikis?.map((wiki) => (
              <li key={wiki.id} className="p-4">
                <WikiCard wiki={wiki} />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <Typography variant="h2" className="text-primary">
              No wikis found
            </Typography>
          </>
        )}
      </section>
    </section>
  );
}
