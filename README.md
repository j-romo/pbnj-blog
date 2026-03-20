# Peanut Butter and Jelly Blog

A modern blog powered by Astro and Sanity CMS with custom component support.

**Live Site:** [peanutbutterandjelly.ai](https://peanutbutterandjelly.ai)  
**CMS:** [pbnj-blog-cms.sanity.studio](https://pbnj-blog-cms.sanity.studio)

## Architecture Overview

This project uses **two separate applications** that work together:

### 1. Frontend Application (Astro)
- **Framework:** Astro v5.13.3 (Static Site Generator)
- **Hosting:** GitHub Pages
- **Deployment:** Automatic via GitHub Actions on push to `main`
- **Purpose:** Public-facing blog website
- **URL:** `https://peanutbutterandjelly.ai`

### 2. CMS Application (Sanity Studio)
- **Framework:** Sanity Studio v5.11.0 (React-based admin interface)
- **Hosting:** Sanity Cloud
- **Deployment:** Manual via Sanity CLI (`npx sanity deploy`)
- **Purpose:** Content management and editing interface
- **URL:** `https://pbnj-blog-cms.sanity.studio`

```
┌─────────────────────────────────────────────────┐
│              Content Workflow                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Create/Edit Content                         │
│     └─> Sanity Studio (pbnj-blog-cms)           │
│         • Write posts with isLive toggle        │
│         • Preview using Presentation Tool       │
│                                                 │
│  2. Content Saved to Sanity Cloud               │
│     └─> Sanity API (Dataset: production)        │
│                                                 │
│  3. Astro Site Fetches Content                  │
│     └─> Build time via Sanity Client            │
│         • Published posts only                  │
│         • Filtered by isLive: true              │
│                                                 │
│  4. Static Site Generated                       │
│     └─> GitHub Actions builds & deploys         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 🚀 Project Structure

```text
pbnj-blog/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── PortableText.astro       # Main Portable Text renderer
│   │   ├── PortableTextImage.astro  # Image block renderer
│   │   ├── PortableTextTable.astro  # Table block renderer
│   │   ├── PortableTextCodeBlock.astro        # Code block renderer
│   │   ├── PortableTextAccordion.astro        # Accordion renderer
│   │   ├── PortableTextChatConversation.astro # Chat renderer
│   │   ├── PortableTextHandwrittenNote.astro  # Note renderer
│   │   ├── PortableTextContainerColumns.astro # Boxed columns
│   │   ├── PortableTextNewspaperColumns.astro # Text columns
│   │   ├── PortableTextDivider.astro          # Divider renderer
│   │   └── ...
│   ├── sanity/
│   │   ├── schemaTypes/
│   │   │   ├── index.ts             # Schema registry
│   │   │   ├── post.ts              # Blog post schema (with isLive field)
│   │   │   ├── author.ts            # Author schema
│   │   │   ├── category.ts          # Category schema
│   │   │   └── objects/
│   │   │       ├── figure.ts        # Figure/image component
│   │   │       ├── table.ts         # Table component
│   │   │       ├── accordion.ts     # Accordion component
│   │   │       ├── codeBlock.ts     # Code block component
│   │   │       ├── chatConversation.ts      # Chat component
│   │   │       ├── handwrittenNote.ts       # Note component
│   │   │       ├── containerColumns.ts      # Boxed columns
│   │   │       ├── newspaperColumns.ts      # Text columns
│   │   │       └── divider.ts       # Divider component
│   │   └── lib/
│   │       ├── load-query.ts        # Query loader with perspective
│   │       └── url-for-image.ts     # Image URL builder
│   ├── lib/
│   │   ├── sanityClient.ts          # Sanity API client
│   │   └── presentation/
│   │       └── resolve-production-url.ts  # Presentation tool config
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── index.astro          # Blog listing (isLive filtered)
│   │   │   └── [...slug].astro      # Blog post pages
│   │   └── index.astro              # Homepage
│   └── layouts/
├── docs/                            # Documentation guides
│   ├── islive-workflow-guide.md     # Draft preview workflow
│   ├── adding-custom-components-guide.md
│   └── component-reference-library.md
├── sanity.config.ts                 # Sanity Studio configuration
├── sanity.cli.ts                    # Sanity CLI configuration
└── astro.config.mjs                 # Astro configuration
```

**Key Points:**
- Blog content comes from **Sanity CMS**, not local markdown files
- Custom components are defined in \`src/sanity/schemaTypes/objects/\`
- Portable Text renderers in \`src/components/\` handle component display
- Static site is built from Sanity content at build time

## 🧞 Commands

### Astro (Frontend) Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

### Sanity Studio (CMS) Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npx sanity dev`          | Start Sanity Studio locally at `localhost:3333` |
| `npx sanity deploy`       | Build and deploy Studio to Sanity Cloud         |
| `npx sanity login`        | Log in to Sanity CLI                            |

### Development Workflow

**For local development:**
```bash
# Terminal 1 - Astro frontend
npm run dev

# Terminal 2 - Sanity Studio
npx sanity dev
```

Visit:
- Frontend: http://localhost:4321
- Sanity Studio: http://localhost:3333

**For production deployment:**
```bash
# 1. Commit and push code changes
git add .
git commit -m "Your changes"
git push origin main

# GitHub Actions automatically deploys Astro site ✅

# 2. Deploy Sanity Studio separately (if schema/Studio changed)
npx sanity deploy
```

### Draft Preview Workflow

This blog includes an **iPad-friendly draft preview system** using the `isLive` field:

**How it works:**
- **Publish posts** in Sanity (builds the page)
- **Toggle `isLive: false`** to hide from blog listing
- **Preview via**:
  - Presentation Tool in Sanity Studio
  - Direct URL: `https://peanutbutterandjelly.ai/blog/post-slug`
- **Go live** by toggling `isLive: true`

**Benefits:**
- ✅ Write and preview from iPad
- ✅ Share direct links for review
- ✅ No separate preview hosting needed
- ✅ Temporarily hide/unhide posts

See [docs/islive-workflow-guide.md](docs/islive-workflow-guide.md) for complete details.

## 🎨 Custom Components

This blog supports custom block-level components in blog posts:

- ✅ **Images/Figures** - Responsive images with hotspot cropping, captions, and attribution
- ✅ **Tables** - Structured data tables with headers and cell styling
- ✅ **Code Blocks** - Syntax-highlighted code with language labels
- ✅ **Accordions** - Collapsible content sections with expand/collapse
- ✅ **Chat Conversations** - Message bubbles for dialogue/chat displays
- ✅ **Handwritten Notes** - Stylized note blocks (sticky, notebook, sketch styles)
- ✅ **Container Columns** - Boxed two-column layouts for comparisons
- ✅ **Newspaper Columns** - Plain text columns for magazine-style layouts
- ✅ **Dividers** - Visual separators with multiple styles

To add new custom components or learn more about existing ones, see the guides in [/docs](docs/).

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Portable Text Specification](https://github.com/portabletext/portabletext)

## 🔧 Configuration

**Sanity Project:**
- Project ID: `69ah3koy`
- Dataset: `production`
- Studio Host: `pbnj-blog-cms`

**Environment:**
- Node.js v18+ required
- TypeScript enabled
- ESM modules
