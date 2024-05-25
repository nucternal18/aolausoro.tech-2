import type { ReactNode, ElementType } from "react";

/**
 * This file contains the types and prop-types for Typography component.
 */
export type colors =
  | "blue-gray"
  | "gray"
  | "brown"
  | "deep-orange"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "light-green"
  | "green"
  | "teal"
  | "cyan"
  | "light-blue"
  | "blue"
  | "indigo"
  | "deep-purple"
  | "purple"
  | "pink"
  | "red";
export type variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "lead"
  | "blockquote"
  | "large"
  | "small"
  | "muted";
export type color = "inherit" | "current" | "black" | "white" | colors;
export type asType = ElementType;
export type textGradient = boolean;
export type className = string;
export type children = ReactNode;
export declare const propTypesVariant: any;
export declare const propTypesColor: any;
export declare const propTypesAs: any;
export declare const propTypesTextGradient: any;
export declare const propTypesClassName: any;
export declare const propTypesChildren: any;
