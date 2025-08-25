import {defineConfig} from 'sanity'
import {schema} from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'PB&J Blog',
  api: {
    projectId: '69ah3koy',
    dataset: 'production',
  },
  schema,
})