import React from "react";
import HomeComponent from "../../components/home";
import { getCV } from "@components/admin-route-components/actions/cv";
import { getPostsMeta } from "@lib/posts";
import type { Meta } from "types/index";
import { getProjects } from "@components/admin-route-components/actions/projects";

export default async function Page() {
  const data = await getCV();
  const posts = await getPostsMeta();
  const projects = await getProjects();

  return Array.isArray(data) ? (
    <HomeComponent
      data={data}
      posts={posts || ([] as Meta[])}
      projects={projects}
    />
  ) : (
    <div>Error: {JSON.stringify(data)}</div>
  );
}
