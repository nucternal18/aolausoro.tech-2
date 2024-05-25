import React from "react";
import { Button } from "@components/ui/button";
import { Typography } from "@components/Typography";

export default function IssuePage() {
  return (
    <section className="p-4">
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
