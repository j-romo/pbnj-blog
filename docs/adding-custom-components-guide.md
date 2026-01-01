# How to Add Custom Components to Sanity Studio (Astro + Sanity)

**Date Created:** January 1, 2026  
**Last Updated:** January 1, 2026

This guide documents the complete process for adding custom block-level components (like tables, code blocks, callouts, etc.) to a blog using Astro and Sanity CMS.

## Architecture Overview

Our blog uses:
- **Astro** for the frontend (static site generator)
- **Sanity Studio** for content management
- **Portable Text** for rich text content rendering
- **GitHub Pages** for deployment 

### Key Files Structure

```
pbnj-blog/
├── src/
│   ├── components/
│   │   ├── PortableText.astro          # Main renderer registry
│   │   ├── PortableTextImage.astro     # Image renderer
│   │   └── PortableTextTable.astro     # Table renderer (example)
│   └── sanity/
│       ├── schemaTypes/
│       │   ├── index.ts                # Schema type registry
│       │   ├── post.ts                 # POST SCHEMA - CRITICAL!
│       │   ├── blockContent.ts         # Reusable block content (optional)
│       │   └── objects/
│       │       ├── figure.ts           # Custom object schemas
│       │       └── table.ts            # Table schema (example)
├── sanity.config.mjs                   # Sanity Studio config
└── astro.config.mjs                    # Astro config
```

## Complete Step-by-Step Process

### Step 1: Create the Schema Definition

Create a new schema file in `src/sanity/schemaTypes/objects/[component-name].ts`:

```typescript
// Example: src/sanity/schemaTypes/objects/table.ts
import { defineType } from 'sanity';

export default defineType({
  name: 'table',           // Unique identifier
  title: 'Table',          // Display name in Studio
  type: 'object',          // Always 'object' for custom blocks
  fields: [
    {
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'row',
          fields: [
            {
              name: 'cells',
              title: 'Row Cells',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }) {
              return {
                title: cells ? cells.join(' | ') : 'Empty row',
              };
            },
          },
        },
      ],
    },
    {
      name: 'caption',
      title: 'Table Caption',
      type: 'string',
      description: 'Optional caption for the table',
    },
    {
      name: 'hasHeader',
      title: 'First Row is Header',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: { caption: 'caption', rows: 'rows' },
    prepare({ caption, rows }) {
      const rowCount = rows?.length || 0;
      return {
        title: caption || 'Table',
        subtitle: `${rowCount} rows`,
      };
    },
  },
});
```

### Step 2: Register Schema in Index

Add the import and register in `src/sanity/schemaTypes/index.ts`:

```typescript
import table from "./objects/table";

export const schema = {
  types: [authorType, blockContentType, categoryType, postType, figure, table], // Add here
};
```

### Step 3: Add to Post Schema (CRITICAL!)

**This is the most important step that's easy to miss!**

Edit `src/sanity/schemaTypes/post.ts` and add your component to the `body` field:

```typescript
defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    { type: 'block' },      // for rich text
    { type: 'image', options: { hotspot: true } }, // for images
    { type: 'table' },      // ADD YOUR COMPONENT HERE
  ],
}),
```

**Why this matters:** The `post.ts` file defines its own body field inline and doesn't use the `blockContent` type. This is where the Studio looks for available block types.

### Step 4: Create the Astro Renderer Component

Create `src/components/PortableText[ComponentName].astro`:

```astro
---
// Example: src/components/PortableTextTable.astro
const { node } = Astro.props;

if (!node || !node.rows) {
  console.error("PortableTextTable missing rows:", Astro.props);
  return null;
}

const { rows, caption, hasHeader = true } = node;
const headerRow = hasHeader && rows.length > 0 ? rows[0] : null;
const bodyRows = hasHeader ? rows.slice(1) : rows;
---

<figure class="table-wrapper">
  <div class="table-container">
    <table>
      {headerRow && (
        <thead>
          <tr>
            {headerRow.cells?.map((cell: string) => <th>{cell}</th>)}
          </tr>
        </thead>
      )}
      <tbody>
        {bodyRows.map((row: any) => (
          <tr>
            {row.cells?.map((cell: string) => <td>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  {caption && <figcaption>{caption}</figcaption>}
</figure>

<style>
  /* Add your styling here */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead th {
    background-color: #f5f5f5;
    font-weight: 600;
    padding: 0.75rem 1rem;
  }
  /* ... more styles */
</style>
```

### Step 5: Register the Renderer

Update `src/components/PortableText.astro`:

```astro
---
import { PortableText as PortableTextComponent } from 'astro-portabletext';
import PortableTextImage from './PortableTextImage.astro';
import PortableTextTable from './PortableTextTable.astro'; // Import

const { value } = Astro.props;

const components = {
  type: {
    image: PortableTextImage,
    table: PortableTextTable,  // Register here
  },
};
---

<PortableTextComponent value={value} components={components} />
```

### Step 6: Restart Sanity Studio

**Important:** Sanity Studio needs to be restarted to pick up schema changes.

```bash
# Kill the running studio
# Then restart in development mode (NOT production preview)
npx sanity dev
```

**Use `npx sanity dev` NOT `npx sanity start`**
- `sanity dev` = development mode with live reloading
- `sanity start` = production preview mode (caches schemas)

### Step 7: Test the Component

1. **In Sanity Studio** (http://localhost:3333/):
   - Open a post
   - Look for your new component button in the Body field
   - Add content and save

2. **In Astro** (http://localhost:4321/):
   - Start: `npm run dev`
   - Navigate to the post
   - Verify the component renders correctly

### Step 8: Deploy the Sanity Studio (CRITICAL!)

**This is a separate deployment from your Astro site!**

Once you've confirmed everything works locally, you MUST deploy the Sanity Studio separately:

```bash
# Build the studio
npx sanity build

# Deploy to Sanity's hosting
npx sanity deploy dist
```

When prompted "dist is not empty, do you want to proceed?", type `y` and press Enter.

**Success message:**
```
Success! Studio deployed to https://your-studio-name.sanity.studio/
```

#### Why Separate Deployment?

Your blog has **two separate applications**:

1. **Astro Website** (Frontend)
   - Hosted on: GitHub Pages
   - Built from: Your Astro source code
   - Deployed when: You push to GitHub (via GitHub Actions)
   - URL: `https://peanutbutterandjelly.ai`

2. **Sanity Studio** (CMS/Admin Interface)
   - Hosted on: Sanity's cloud hosting
   - Built from: Your Sanity schema files
   - Deployed when: You run `npx sanity deploy`
   - URL: `https://your-project.sanity.studio`

**The Astro site READS data from Sanity via API, but the Studio interface itself is a separate React app that must be deployed independently.**

#### Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Your Workflow                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. Change schema files (add table component)       │
│     └─> src/sanity/schemaTypes/                     │
│                                                      │
│  2. Test locally                                     │
│     └─> npx sanity dev (Studio at localhost:3333)   │
│     └─> npm run dev (Site at localhost:4321)        │
│                                                      │
│  3. Commit and push to GitHub                        │
│     └─> git commit & git push                        │
│     └─> Triggers Astro build via GitHub Actions     │
│     └─> Astro site updates (can read new data)      │
│                                                      │
│  4. Deploy Sanity Studio separately! ⚠️             │
│     └─> npx sanity build                            │
│     └─> npx sanity deploy dist                      │
│     └─> Studio UI updates (can create new data)     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

#### Common Deployment Issues

**Problem:** "Table component works locally but not in production Studio"
- **Cause:** You deployed the Astro site but forgot to deploy the Studio
- **Solution:** Run `npx sanity build && npx sanity deploy dist`

**Problem:** "Error: sanity.cli.js does not contain a project identifier"
- **Cause:** Missing or incorrectly formatted CLI config file
- **Solution:** Create `sanity.cli.ts`:
  ```typescript
  import { defineCliConfig } from 'sanity/cli';
  
  export default defineCliConfig({
    api: {
      projectId: 'your-project-id',
      dataset: 'production'
    },
    studioHost: 'your-studio-name'
  });
  ```

**Problem:** "Failed to resolve sanity.config.(js|ts)"
- **Cause:** This is often a warning, not a fatal error
- **Solution:** Check if deployment still succeeded. If not, ensure `sanity.config.mjs` exists with proper structure

**Problem:** Not logged in to Sanity CLI
- **Solution:** Run `npx sanity login` before deploying

## Common Pitfalls & Solutions

### Problem: Component doesn't appear in Sanity Studio

**Checklist:**
1. ✅ Did you add it to `post.ts` in the `body` field? (Most common issue!)
2. ✅ Did you register it in `index.ts`?
3. ✅ Did you restart Sanity Studio with `npx sanity dev`?
4. ✅ Did you hard refresh the browser (Cmd+Shift+R)?
5. ✅ Check for multiple config files (`sanity.config.js` vs `.mjs`)
6. ✅ Clear Sanity cache: `rm -rf .sanity && npx sanity dev`

### Problem: Component renders as [object Object] or shows raw data

**Solution:** Check that:
1. The renderer component is imported in `PortableText.astro`
2. The component name in the registry matches the schema name exactly
3. You're accessing `node` props correctly (not `value`)

### Problem: TypeScript errors in schema

**Solution:**
- Ensure all fields have proper type definitions
- Use `defineType` from 'sanity' for object definitions
- Check that nested objects have unique `name` properties

### Problem: Schema loads but data doesn't save

**Solution:**
- Check browser console for validation errors
- Ensure required fields have validation rules
- Verify field names don't conflict with Sanity reserved words

## Quick Reference Checklist

When adding a new component:

```
□ Create schema file in src/sanity/schemaTypes/objects/
□ Import and register in src/sanity/schemaTypes/index.ts
□ Add to post.ts body field (CRITICAL!)
□ Create renderer in src/components/PortableText[Name].astro
□ Import and register in src/components/PortableText.astro
□ Restart Sanity Studio (npx sanity dev)
□ Test in Studio (add content)
□ Test in Astro (view rendered output)
□ Commit changes
□ Deploy Sanity Studio (npx sanity build && npx sanity deploy dist)
□ Verify on live studio site
```

## Example: Adding a Callout/Alert Component

Here's another example for reference:

```typescript
// src/sanity/schemaTypes/objects/callout.ts
export default defineType({
  name: 'callout',
  title: 'Callout Box',
  type: 'object',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
          { title: 'Success', value: 'success' },
          { title: 'Error', value: 'error' },
        ],
      },
      initialValue: 'info',
    },
    {
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
    },
  ],
});
```

Then follow steps 2-7 above.

## Debugging Tips

1. **Use browser console:** Check for React/Sanity errors
2. **Use Astro dev logs:** Watch for component rendering errors
3. **Simplify first:** Start with basic fields, add complexity later
4. **Check the data:** Use Sanity Vision or API to see raw data structure
5. **Compare working examples:** Look at how `image` or `figure` are implemented

## Resources

- [Sanity Schema Types Docs](https://www.sanity.io/docs/schema-types)
- [Portable Text Spec](https://github.com/portabletext/portabletext)
- [Astro Portabletext](https://github.com/theisel/astro-portabletext)

## Version History

- **v1.0** (Jan 1, 2026) - Initial guide created after adding table component
- Key lesson learned: Always check `post.ts` first!

---

**For Future AI Assistants:** The critical file is `src/sanity/schemaTypes/post.ts`. The body field there must include the component type. Don't spend time only editing `blockContent.ts` if the post schema doesn't reference it.
