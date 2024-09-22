import React from "react";
import HomeComponent from "./home";
import { getCV } from "@app/actions/cv";

export default async function Page() {
  const data = await getCV();

  return (
    <section className="relative flex flex-grow items-center justify-center h-screen mx-auto">
      {Array.isArray(data) ? (
        <HomeComponent data={data} />
      ) : (
        <div>Error: {JSON.stringify(data)}</div>
      )}
    </section>
  );
}
