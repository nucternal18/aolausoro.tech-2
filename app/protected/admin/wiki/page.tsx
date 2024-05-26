import { Typography } from "@components/Typography";
import React from "react";

export default function Page() {
  return (
    <section className="container flex-grow w-full h-screen p-2 sm:p-6 space-y-4  mx-auto">
      <Typography variant="h2" className="text-primary">
        Wiki Page
      </Typography>
    </section>
  );
}
