import React from "react";

import { WikiComponent } from "./wiki-component";
import { getWiki } from "@app/actions/wiki";

export default async function Page() {
  const wikis = await getWiki();
  return (
    <section className="container flex-grow w-full h-screen p-2 sm:p-6 space-y-4  mx-auto">
      {Array.isArray(wikis) && wikis.length > 0 ? (
        <WikiComponent wikis={wikis} />
      ) : (
        <div className="flex items-center justify-center h-full text-center">
          <div className="text-lg font-semibold">
            {"message" in wikis ? wikis.message : "No wikis found"}
          </div>
        </div>
      )}
    </section>
  );
}
