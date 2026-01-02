# Peanut Butter and Jelly Blog

A modern blog powered by Astro and Sanity CMS with custom component support.

**Live Site:** [peanutbutterandjelly.ai](https://peanutbutterandjelly.ai)  
**CMS:** [pbnj-blog-cms.sanity.studio](https://pbnj-blog-cms.sanity.studio)

## Architecture Overview

This project uses **two separate applications** that work together:

### 1. Frontend Application (Astro)
- **Framework:** Astro v5.13.3 (Static Site Generator)
- **Hosting:** GitHub Pages
- **Deployment:** Automatic via GitHub Actions on push to \`main\`
- **Purpose:** Public-facing blog website
- **URL:** \`https://peanutbutterandjelly.ai\`

### 2. CMS Application (Sanity Studio)
- **Framework:** Sanity Studio v4.5.0 (React-based admin interface)
- **Hosting:** Sanity Cloud
- **Deployment:** Manual via Sanity CLI (\`npx sanity deploy\`)
- **Purpose:** Content management and editing interface
- **URL:** \`https://pbnj-blog-cms.sanity.studio\`

```
┌─────────────────────────────────────────────────┐
│              Content Workflow                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Create/Edit Content                         │
│     └─> Sanity Studio (pbnj-blog-cms)           │
│                                                 │
│  2. Content Saved to Sanity Cloud               │
│     └─> Sanity API (Dataset: production)        │
│                                                 │
│  3. Astro Site Fetches Content                  │
│     └─> Build time via Sanity Client            │
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
│   │   └── ...
│   ├── sanity/
│   │   ├── schemaTypes/
│   │   │   ├── index.ts             # Schema registry
│   │   │   ├── post.ts              # Blog post schema
│   │   │   └── objects/
│   │   │       ├── figure.ts        # Figure component schema
│   │   │       └── table.ts         # Table component schema
│   │   └── lib/
│   ├── lib/
│   │   └── sanityClient.ts          # Sanity API client
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── index.astro          # Blog listing (from Sanity)
│   │   │   └── [...slug].astro      # Blog post pages (from Sanity)
│   │   └── index.astro
│   └── layouts/
├── sanity.config.mjs                # Sanity Studio configuration
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
| `npx sanity build`        | Build Sanity Studio for production              |
| `npx sanity deploy dist`  | Deploy Studio to Sanity Cloud                   |
| `npx sanity login`        | Log in to Sanity CLI                            |

### Development Workflow

**For local development:**
```bash
# Terminal 1 - Astro frontend
npm run dev

# Terminal 2 - Sanity Studio
npx sanity dev
```

**For production deployment:**
```bash
# 1. Commit and push code changes
git add .
git commit -m "Your changes"
git push origin main

# GitHub Actions automatically deploys Astro site ✅

# 2. Deploy Sanity Studio separately (only if schema changed, adding new components like table, image)
npx sanity build
npx sanity deploy dist
```

## 🎨 Custom Components

This blog supports custom block-level components in blog posts:

- ✅ **Images** with hotspot cropping
- ✅ **Figures** with captions and attribution
- ✅ **Tables** with headers and styling

To add new custom components, see the guides in the \`/docs\` folder (on feature branch).

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
