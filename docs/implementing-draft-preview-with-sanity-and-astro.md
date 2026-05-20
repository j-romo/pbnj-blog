# Implementing Draft Preview in Sanity CMS with Astro: An AI-Assisted Journey

*How I used AI to explore, iterate, and simplify a preview feature for my iPad-friendly blogging workflow*

## Introduction

I recently set out to add a draft preview feature to my blog, [peanutbutterandjelly.ai](https://peanutbutterandjelly.ai), which is built with Astro and Sanity CMS. My goal was simple: write blog posts on my iPad using Sanity Studio, preview them before publishing, and avoid needing my MacBook with VS Code just to see how a post would look.

What started as a straightforward feature request turned into an interesting journey of exploration, iteration, and ultimately simplification. Working with GitHub Copilot, I explored several technical approaches—from server-side rendering to cookie-based preview systems—before discovering that the best solution was much simpler than I initially imagined.

This post walks through the entire implementation journey: the approaches we tried, why they didn't fit my use case, and how clarifying requirements led us to a more focused solution using existing Sanity features.

## The Starting Point

My blog stack:
- **Astro v5.9.1**: Static site generator with `output: "static"`
- **Sanity Studio v5.11.0**: Headless CMS hosted on Sanity Cloud
- **GitHub Pages**: Production deployment at peanutbutterandjelly.ai
- **GitHub Actions**: CI/CD pipeline for automatic deployments

I had an old branch called `drafting-branch` from about a year ago that I thought might contain preview-related work. After comparing it with main, we discovered it was just an old snapshot with no relevant preview code—just a dead end that saved us from going down the wrong path.

## Initial Approach: Complex Preview Systems

### Attempt 1: Server-Side Rendering (SSR)

My first instinct, guided by AI, was to enable SSR mode in Astro to handle dynamic preview rendering. The plan was:
1. Change Astro config to `output: "hybrid"`
2. Create API endpoints for draft mode
3. Use cookies to manage preview state

```javascript
// astro.config.mjs - Initial SSR attempt
export default defineConfig({
  output: 'hybrid',
  adapter: node({
    mode: 'standalone'
  }),
  // ... rest of config
});
```

**The Problem**: Almost immediately, we hit a critical error:

```
config.studioUrl must be defined to use presentationTool
```

This led us down a rabbit hole of trying to configure the Presentation Tool properly, but more fundamentally, SSR didn't align with my deployment strategy. I'm using GitHub Pages with static builds—there's no Node.js server running in production.

### Attempt 2: Cookie-Based Preview with API Routes

Undeterred, we pivoted to a cookie-based approach that would work with static generation. The idea was to create API endpoints that would set/clear preview cookies:

```typescript
// src/pages/api/draft.ts - Cookie-based preview attempt
export async function GET({ request, cookies, redirect }: APIContext) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  
  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 });
  }

  cookies.set('preview-mode', 'true', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });

  return redirect(`/blog/${slug}`);
}
```

We also created an exit endpoint:

```typescript
// src/pages/api/exit-draft.ts
export async function GET({ cookies, redirect }: APIContext) {
  cookies.delete('preview-mode', { path: '/' });
  return redirect('/blog');
}
```

**The Problem**: This approach had several issues:
1. Static sites can't read cookies at build time
2. Client-side cookie checking would require JavaScript and hurt performance
3. The complexity didn't match the static nature of my site
4. Still couldn't preview true unpublished drafts without rebuilding

### Attempt 3: Vercel Preview Routes

We briefly considered using Vercel's preview deployment features with their edge functions. Vercel has built-in support for draft modes and preview environments.

**The Problem**: I'm not using Vercel—I'm deploying to GitHub Pages via GitHub Actions. This would require changing my entire deployment infrastructure, which seemed like massive overkill for a preview feature. The simplicity of GitHub Actions + GitHub Pages was a feature, not a limitation.

## The Clarity Moment: iPad Workflow Requirements

After these attempts, I stepped back and clarified my actual requirements:

> "I'm planning to have this feature so I can work on my iPad and create posts and preview from the iPad browser without having to use the MacBook with VS Code."

This clarification was crucial. I didn't need:
- Real-time draft previews of unpublished content
- Complex server-side rendering
- Cookie management or session state
- A separate preview deployment environment

What I actually needed:
- Write posts in Sanity Studio on my iPad
- See a live preview while editing
- Hide posts from the blog listing until ready to publish
- Access posts via direct URL for review

This was fundamentally different from the "draft preview" systems I'd been trying to build!

## The Elegant Solution: isLive Boolean + Presentation Tool

Once the requirements were clear, the solution became obvious—and it was mostly already built into Sanity.

### Part 1: The isLive Field

Instead of dealing with draft/published states, I added a simple boolean field to control visibility:

```typescript
// src/sanity/schemaTypes/post.ts
defineField({
  name: 'isLive',
  type: 'boolean',
  title: 'Live on Blog',
  description: 'Toggle to show/hide this post on the public blog listing',
  initialValue: true,
  validation: (Rule) => Rule.required(),
})
```

This field goes right after `pubDate` in the schema. The key insight: **publish** the post in Sanity (so it's in the dataset and gets built), but use `isLive` to control whether it appears in the blog listing.

### Part 2: Filter Blog Listing

Update the blog index page to filter by `isLive`:

```astro
---
// src/pages/blog/index.astro
const { data: posts } = await loadQuery<Post[]>({
  query: `*[_type == "post" && (isLive == true || !defined(isLive))] | order(pubDate desc) {
    _id,
    title,
    pubDate,
    description,
    heroImage,
    "slug": slug.current,
    isLive
  }`,
});
---
```

The `!defined(isLive)` part ensures backward compatibility with older posts that don't have this field yet.

### Part 3: Build All Post Pages

The crucial part—ensure ALL published posts get pages built, regardless of `isLive` status:

```astro
---
// src/pages/blog/[...slug].astro
export async function getStaticPaths() {
  const posts = await sanityClient.fetch<Post[]>(
    `*[_type == "post"] | order(pubDate desc)` // No isLive filter here!
  );

  return posts.map((post) => ({
    params: { slug: post.slug.current },
    props: { post },
  }));
}
---
```

This means a post with `isLive: false` won't appear in the blog listing, but the page exists at `/blog/post-slug` and can be accessed directly. It's like an unlisted YouTube video—the content is published, but you need the direct link to see it.

### Part 4: Sanity Presentation Tool

The real magic happens with Sanity's built-in Presentation Tool. This provides a live preview right inside Sanity Studio:

```typescript
// sanity.config.ts
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { resolveProductionUrl } from './src/lib/presentation/resolve-production-url';

export default defineConfig({
  name: 'default',
  title: 'PB&J Blog',
  projectId: 'your-project-id',
  dataset: 'production',
  
  plugins: [
    // ... other plugins
    presentationTool({
      resolve: resolveProductionUrl,
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'https://peanutbutterandjelly.ai',
        previewMode: {
          enable: '/api/draft',
        }
      },
    }),
  ],
});
```

The resolver maps Sanity documents to preview URLs:

```typescript
// src/lib/presentation/resolve-production-url.ts
import type { PresentationPluginOptions } from 'sanity/presentation';

export const resolveProductionUrl: PresentationPluginOptions['resolve'] = {
  locations: {
    post: {
      resolve: (doc) => {
        const slug = (doc?.slug as { current?: string })?.current;
        if (!slug) {
          return { locations: [] };
        }
        return {
          locations: [
            {
              title: doc?.title || 'Untitled',
              href: `/blog/${slug}`,
            },
          ],
        };
      },
    },
  },
};
```

### Part 5: CORS Configuration

To enable the Presentation Tool to communicate with your Astro site:

```javascript
// astro.config.mjs
export default defineConfig({
  // ... other config
  vite: {
    server: {
      cors: {
        origin: [
          'http://localhost:3333',
          'https://pbnj-blog-cms.sanity.studio',
          'https://peanutbutterandjelly.ai'
        ],
        credentials: true,
      },
    },
  },
});
```

Also add these origins in your Sanity project settings (Manage > API > CORS Origins).

## The Complete Workflow

Here's how the iPad workflow works in practice:

1. **Open Sanity Studio** on iPad at https://pbnj-blog-cms.sanity.studio
2. **Create a new post** with all content and media
3. **Set `isLive: false`** to hide from blog listing
4. **Publish the post** in Sanity (important: publish, don't save as draft!)
5. **Trigger GitHub Actions** deployment (commit + push, or manual trigger)
6. **Open Presentation Tool** in Sanity Studio to preview the live page
7. **Share direct URL** for review: `https://peanutbutterandjelly.ai/blog/post-slug`
8. **When ready, set `isLive: true`** and publish again
9. **Post appears in blog listing** on next deployment

The beauty of this approach: no server-side logic, no special deployment infrastructure, and it works perfectly on an iPad.

## Deployment Considerations

### Why Not Vercel?

Vercel offers excellent draft mode capabilities with their edge functions and preview deployments. However:

- **GitHub Pages is free** for public repos—Vercel's free tier has build minute limits
- **GitHub Actions is simple**—just git push and it deploys
- **No vendor lock-in**—it's just static files
- **My use case doesn't need** Vercel's complexity

For a personal blog with infrequent updates, the GitHub Pages + GitHub Actions combo is perfect.

### Deploying the Schema

After adding the `isLive` field, deploy it to Sanity Cloud:

```bash
npx sanity deploy
```

This single command builds and deploys your Studio. In older Sanity versions, you had to run `npx sanity build dist` then `npx sanity deploy dist`—the modern CLI combines these steps.

## Lessons Learned: Errors and Fixes

### Error 1: "resolvers is not iterable"

**The Error**:
```
PresentationTool: resolvers is not iterable
```

**The Problem**: I initially structured the resolver incorrectly:

```typescript
// ❌ Wrong
export const resolveProductionUrl: PresentationPluginOptions['resolve'] = {
  mainDocuments: (prev, studio) => prev,
  resolvers: {
    post: (doc) => { /* ... */ }
  }
};
```

**The Fix**: The correct structure uses `locations` instead of `resolvers`:

```typescript
// ✅ Correct
export const resolveProductionUrl: PresentationPluginOptions['resolve'] = {
  locations: {
    post: {
      resolve: (doc) => { /* ... */ }
    }
  }
};
```

### Error 2: "Unable to connect" in Presentation Tool

**The Error**: Presentation Tool showed "Unable to connect to preview" with CORS errors in console.

**The Problem**: Missing CORS configuration in both Astro and Sanity.

**The Fix**: 
1. Add CORS config to `astro.config.mjs` (shown above)
2. Add CORS origins in Sanity project settings
3. Ensure both `http://localhost:3333` (dev) and production URL are included
4. Set `credentials: true` in Astro's CORS config

### Error 3: "Missing slug parameter"

**The Error**:
```
Missing slug parameter
```

**The Context**: This was from the cookie-based preview attempt with `/api/draft` endpoints.

**The Learning**: This error helped us realize we were overcomplicating things. We didn't need API endpoints at all—we just needed to build pages for all published posts and filter the listing.

### Error 4: WebSocket Warning in Presentation Tool

**The Warning**:
```
WebSocket connection failed for preview updates
```

**The Impact**: None—the Presentation Tool still works perfectly for previewing content.

**The Learning**: This is expected for static sites without a WebSocket server. The preview still loads and updates when you refresh. For my use case (checking layout and content before publishing), this is perfectly adequate.

### Error 5: "config.studioUrl must be defined"

**The Error**: When initially trying SSR mode with Presentation Tool.

**The Problem**: Trying to use features designed for server-rendered applications in a static site context.

**The Learning**: Read the documentation context carefully. Many Sanity + Astro examples assume SSR or hybrid mode. For static sites, the requirements and capabilities are different.

## Code Organization

Here's how the files are organized:

```
pbnj-blog/
├── src/
│   ├── lib/
│   │   └── presentation/
│   │       └── resolve-production-url.ts
│   ├── pages/
│   │   └── blog/
│   │       ├── index.astro (filtered listing)
│   │       └── [...slug].astro (all posts)
│   └── sanity/
│       └── schemaTypes/
│           └── post.ts (isLive field)
├── docs/
│   └── islive-workflow-guide.md
├── sanity.config.ts (presentationTool)
└── astro.config.mjs (CORS)
```

## Alternative Approaches Considered

### 1. Separate Preview Branch
Build preview versions to a separate `preview` branch and deploy to a different URL.

**Pros**: True isolated preview environment
**Cons**: Requires separate deployment infrastructure, more complex CI/CD, two sites to maintain

### 2. Password-Protected Pages
Use Cloudflare Workers or similar to add authentication to preview URLs.

**Pros**: More secure, can share previews with clients
**Cons**: Requires external service, adds complexity, overkill for personal blog

### 3. True Draft Mode with Rebuild
Keep drafts in Sanity, trigger rebuild when you want to preview.

**Pros**: Cleaner separation of draft/published
**Cons**: Slow feedback loop (wait for build), wastes GitHub Actions minutes

## Reflections on Working with AI

This implementation journey highlighted both the strengths and limitations of AI-assisted development:

### What Worked Well

1. **Rapid prototyping**: AI helped me quickly test different approaches (SSR, cookies, APIs) without getting stuck in analysis paralysis
2. **Error debugging**: When I hit errors, AI could quickly identify common causes and suggest fixes
3. **Code generation**: Boilerplate like schema definitions, GROQ queries, and API endpoints were generated quickly
4. **Documentation parsing**: AI helped interpret Sanity and Astro docs to understand configuration options

### What Required Human Judgment

1. **Requirements clarification**: AI suggested complex solutions because I hadn't clearly articulated the iPad workflow requirement
2. **Architecture decisions**: Deciding to skip Vercel and stick with GitHub Pages required understanding my specific context
3. **Scope reduction**: Recognizing when to pivot from complex to simple solutions
4. **Trade-off evaluation**: Weighing the pros/cons of different approaches based on my actual needs

The key learning: **AI is excellent at exploring the solution space, but you need to clearly define the problem space.** Once I articulated "iPad-friendly preview with static deployment," the right solution became obvious.

## Conclusion

What started as a mission to implement a complex draft preview system ended with a simple, elegant solution using mostly built-in Sanity features:

- One boolean field (`isLive`)
- One filter in the blog listing query
- Sanity's existing Presentation Tool
- Standard GitHub Actions deployment

The result is an iPad-friendly workflow that lets me write posts anywhere, preview them in Sanity Studio, and publish when ready—all without needing to open VS Code or mess with complex server-side rendering.

Sometimes the best solution isn't the most sophisticated one. By clarifying requirements and leveraging existing platform features, we avoided overengineering and ended up with something that's easier to maintain, faster to implement, and perfectly suited to my actual needs.

## Resources

- [Sanity Presentation Tool Docs](https://www.sanity.io/docs/presentation)
- [Astro Static Site Generation](https://docs.astro.build/en/guides/static-site/)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [GitHub Pages Deployment](https://docs.github.com/en/pages)

---

*This blog post documents real implementation work on [peanutbutterandjelly.ai](https://peanutbutterandjelly.ai), assisted by GitHub Copilot. All code examples are from the actual production codebase.*
