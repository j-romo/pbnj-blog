import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'studio',
  title: 'PB&J Blog Studio',
  projectId: '69ah3koy',
  dataset: 'production',
  plugins: [structureTool()],
  schema,
})