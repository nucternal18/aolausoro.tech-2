import React from "react";

import { WikiComponent } from "./wiki-component";

export default function Page() {
  return (
    <section className="container flex-grow w-full h-screen p-2 sm:p-6 space-y-4  mx-auto">
      <WikiComponent />
    </section>
  );
}
