import React from "react";
import HomeComponent from "./home";
import { getCV } from "@app/actions/cv";

export default async function Page() {
  const data = await getCV();
  return (
    <section className="relative flex flex-grow items-center h-screen mx-auto">
      {Array.isArray(data) ? (
        <HomeComponent {...data} />
      ) : (
        <div>Error: {data.error}</div>
      )}
    </section>
  );
}
