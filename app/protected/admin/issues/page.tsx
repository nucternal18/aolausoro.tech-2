import React from "react";
import { Button } from "@components/ui/button";
import { Typography } from "@components/Typography";

export default function IssuePage() {
  return (
    <section className="container flex-grow w-full h-screen p-2 sm:p-6 space-y-4  mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="text-primary">
            Issues
          </Typography>

          <Typography className="text-primary">
            Here you can manage your issues
          </Typography>
        </div>
        <Button>New Issue</Button>
      </div>
    </section>
  );
}
