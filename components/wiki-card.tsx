import Image from "next/image";

import { Typography } from "./Typography";
import type { PartialWikiProps } from "@src/entities/models/Wiki";

export default function WikiCard({
  wiki: { title, description, imageUrl },
}: {
  wiki: PartialWikiProps;
}) {
  return (
    <div className="relative group overflow-hidden break-inside-avoid rounded-lg shadow-lg hover:shadow-2xl shadow-neutral-700 transition-all duration-300 ease-in-out">
      <Image
        src={imageUrl as string}
        alt={title as string}
        sizes="100vw"
        width={600}
        height={400}
        style={{ width: "100%", height: "50%" }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-white transition-all duration-300 ease-in-out group-hover:bg-gradient-to-t group-hover:from-black/80 group-hover:to-transparent">
        <Typography variant="h4" className="text-primary">
          {title}
        </Typography>
        <Typography className="text-primary">{description}</Typography>
      </div>
    </div>
  );
}
