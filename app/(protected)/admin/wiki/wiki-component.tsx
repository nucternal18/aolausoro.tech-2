"use client";

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
      <section className="flex justify-between items-center">
        <Typography
          variant="h2"
          className="text-sm text-primary md:text-base lg:text-2xl"
        >
          Wiki Page
        </Typography>
        <Progress value={progress} className="w-[50%] md:w-[60%]" />
        <UploadImageModal />
      </section>
      <section className="py-10">
        {Array.isArray(wikis) && wikis.length > 0 ? (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
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
