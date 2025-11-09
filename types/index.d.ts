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
  readTime?: string;
};

export type BlogPost = {
  meta: Meta;
  contentHtml: ReactElement<any, string | JSXElementConstructor<any>>;
};

// TS Code to turn an object type into an object of getters
type BackendObj = {
  id: string;
  name: string;
  email: string;
  age: number;
};

// First, create a mapped type
type NewObj = {
  [K in keyof BackendObj]: BackendObj[K];
};

// then, remap the key of the mapped type...
type NewObj = {
  [K in keyof BackendObj as `get${K}`]: BackendObj[K];
};

// Remember to capitalize the key
type NewObj = {
  [K in keyof BackendObj as `get${Capitalize<K>}`]: BackendObj[K];
};

// Finally turn the value into a function
type NewObj = {
  [K in keyof BackendObj as `get${Capitalize<K>}`]: () => BackendObj[K];
};

type Target = NewObj;
