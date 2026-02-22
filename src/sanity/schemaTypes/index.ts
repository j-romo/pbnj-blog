// ./src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { authorType } from "./author";
import { blockContentType } from "./blockContent";
import { categoryType } from "./category";
import { postType } from "./post";
import figure from "./objects/figure";
import table from "./objects/table";
import divider from "./objects/divider";
import accordion from "./objects/accordion";
import codeBlock from "./objects/codeBlock";
import chatConversation from "./objects/chatConversation";

export const schema = {
  types: [authorType, blockContentType, categoryType, postType, figure, table, divider, accordion, codeBlock, chatConversation],
};