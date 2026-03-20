import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {schema} from './src/sanity/schemaTypes'
import resolveProductionUrl from './src/lib/presentation/resolve-production-url'

// Get from environment or use fallback
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '69ah3koy'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'PB&J Blog',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool(),
    presentationTool({
      resolve: resolveProductionUrl,
      previewUrl: {
        // Use production URL for deployed studio, localhost for local dev
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'https://peanutbutterandjelly.ai',
      },
    }),
  ],
})