// ./src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { authorType } from "./author";
import { blockContentType } from "./blockContent";
import { categoryType } from "./category";
import { postType } from "./post";
import figure from "./objects/figure";

export const schema = {
  types: [authorType, blockContentType, categoryType, postType, figure],
};