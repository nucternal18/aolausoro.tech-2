import type { JSXElementConstructor } from "react";
import type { Env } from "@lib/env";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export type Meta = {
  id?: string;
  title: string;
  date: string;
  excerpt: string;
  cover_image: string;
  category: string;
  author: string;
  author_image: string;
  tags: string[];
};

export type BlogPost = {
  meta: Meta;
  contentHtml: ReactElement<any, string | JSXElementConstructor<any>>;
};
