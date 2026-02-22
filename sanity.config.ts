import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schema} from './src/sanity/schemaTypes'

// Get from environment or use fallback
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '69ah3koy'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'PB&J Blog',
  projectId,
  dataset,
  schema,
  plugins: [structureTool()]
})