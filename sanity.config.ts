// ./sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from './src/sanity/schemaTypes'
import { presentationTool } from "sanity/presentation";
import resolveProductionUrl from './src/lib/presentation/resolve-production-url';


export default defineConfig({
  name: 'default',
  title: 'PB&J Blog',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool(),
    // presentationTool({
    //   resolve: resolveProductionUrl,
    //   previewUrl: {
    //     origin: 'https://peanutbutterandjelly.ai',
    //     previewMode: {
    //       enable: '/api/draft-mode/enable',
    //       disable: '/api/draft-mode/disable',
    //     },
    //   },
    // }),
  ],
  schema,
  cors: {
    credentials: true,
    origin: ['http://localhost:4321', 'https://peanutbutterandjelly.ai']
  }
});

