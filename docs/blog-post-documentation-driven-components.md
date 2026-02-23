# Self-Documenting Your Dev Workflow: How Writing Guides Made Us 3x Faster

**Published:** February 22, 2026  
**Tags:** Documentation, Developer Experience, Astro, Sanity CMS, Headless CMS

---

There's a moment in every developer's journey when you finally realize: "I should have documented this the first time."

Mine came after spending two hours debugging why my Sanity Studio components weren't showing up in production—even though they worked perfectly on localhost. The problem? I had forgotten that my blog actually consists of **two separate applications** that need independent deployments.

This is the story of how writing documentation for "future me" accidentally made our development process 3x faster.

## The Two-Site Confusion

My blog, [peanutbutterandjelly.ai](https://peanutbutterandjelly.ai), is built with:
- **Astro** for the static frontend (deployed to GitHub Pages)
- **Sanity Studio** for content management (deployed to Sanity's cloud)

When I added my first custom component (a table), I went through this painful cycle:

1. ✅ Write the schema
2. ✅ Create the Astro renderer
3. ✅ Test locally (works!)
4. ✅ Commit and push to GitHub
5. ❌ Component doesn't appear in production Studio
6. 🤔 Spend 30 minutes confused
7. 💡 Remember: "Oh right, I need to deploy the Studio separately!"
8. Run `npx sanity deploy dist`
9. ✅ Finally works

A week later, I added image sizing controls. Same exact confusion. Same 30-minute debugging session. Same forehead slap when I remembered the separate deployment.

## The Breaking Point

After the third time making this mistake, I did what every developer should do more often: **I stopped and wrote it down.**

I created two documentation files:

### 1. [How to Add Custom Components Guide](https://github.com/j-romo/pbnj-blog/blob/main/docs/adding-custom-components-guide.md)
A step-by-step checklist for adding any custom component, including:
- The critical `post.ts` file that everyone forgets
- The difference between `npx sanity dev` and `npx sanity start`
- Why you have to deploy twice (Astro + Studio)
- Common pitfalls and debugging tips

### 2. [Component Reference Library](https://github.com/j-romo/pbnj-blog/blob/main/docs/component-reference-library.md)
A catalog of components we could build, complete with:
- Schema examples
- Use cases and complexity ratings
- Implementation priorities
- Copy-pasteable TypeScript code

The guides took me about 2 hours to write. I figured they'd save me maybe 30 minutes next time.

I was wildly wrong about the ROI.

## The 3x Speed Multiplier

Fast forward one week. I decided to add three new components in one sitting:
- **Divider** (visual separators between sections)
- **Accordion** (collapsible FAQ sections)  
- **Code Block** (syntax-highlighted code with copy buttons)

Armed with my documentation, here's what happened:

**Without guides (previous attempts):** ~3 hours per component
- Schema: 20 min
- Renderer: 40 min
- Testing: 15 min
- Debugging deployment issues: 90 min 😤
- Actually deploying correctly: 15 min

**With guides (this time):** ~20 minutes per component
- Schema: 5 min (reference library had examples)
- Renderer: 10 min (clearer patterns)
- Testing: 3 min (knew what to look for)
- Deployment: 2 min (checklist = no confusion)

**Total time: 60 minutes for all three components. Time saved: ~8 hours.**

But the speed wasn't even the best part.

## The Unexpected Benefits

### 1. Fearless Iteration
With a clear checklist, I wasn't afraid to try complex components. The accordion has nested rich text content and JavaScript interactions—normally I'd save that for "later." But with my guide, I knew exactly what steps to follow and could focus on the creative parts.

### 2. Better Code Quality
The documentation forced me to think about patterns. When I wrote "Step 5: Register the Renderer," I realized I was registering components in slightly different ways each time. Documenting the process revealed the inconsistency.

### 3. AI Collaboration Gold
Here's something I didn't expect: **the documentation became incredible context for working with AI coding assistants.**

When I wanted to add the chat conversation component later, I just shared my guides with Claude. Instead of explaining the entire architecture, deployment process, and gotchas, I could say:

> "Based on these two guides, let's add a chat conversation component with message bubbles."

The AI immediately understood:
- It needed both a schema AND a renderer
- The schema goes in `src/sanity/schemaTypes/objects/`
- It must be added to `post.ts` (the critical file!)
- Testing requires restarting Sanity Studio
- Production requires a separate Studio deployment

**We shipped the chat component—with three visual styles, sender names, timestamps, and full mobile responsiveness—in under 90 minutes.** That would have taken me half a day without the guides.

## The Documentation Architecture

Here's what made these guides actually useful (unlike most documentation):

### ✅ Checklist Format
```
□ Create schema file
□ Register in index.ts  
□ Add to post.ts body field (CRITICAL!)
□ Create renderer component
□ Register in PortableText.astro
□ Restart Sanity Studio
□ Test in Studio
□ Test in Astro
□ Commit changes
□ Deploy Studio separately
```

No walls of text. Just: "Did you do this? Check. Next."

### ✅ The "Why" Explained Once
The guide has a whole section titled "Why Separate Deployment?" with ASCII diagrams showing the two-site architecture. I can reference it instead of re-learning it every time.

### ✅ Real Code Examples
Every component type in the reference library has actual, copy-pasteable TypeScript. No "TODO: implement this" placeholders.

### ✅ Troubleshooting Section
All my mistakes, documented:
- "Component doesn't appear in Studio" → Check `post.ts` 
- "Works locally but not in production" → Did you deploy the Studio?
- "Schema loads but data doesn't save" → Check validation rules

## The ROI Calculation

**Time invested in documentation:** 2 hours  
**Time saved (so far):** ~8 hours  
**Confidence gained:** Immeasurable

**But here's the real ROI:** Before the guides, I would avoid adding components because the process felt painful. Now I actively look for excuses to build new components because I know it'll take less than an hour, not half a day.

## Lessons for Your Own Projects

### 1. Document on the Second Time, Not the First
The first time you do something, you're still learning. The second time, you know what actually matters. That's when you should document.

### 2. Write for "3am Tired You"
Don't write documentation for the smartest version of yourself. Write it for when you're exhausted, distracted, or returning to the project after six months away.

### 3. Checklists > Prose
Dense paragraphs get skipped. Checklists get followed.

### 4. Make It Grep-able
Use specific error messages and keywords. When you Google "sanity component not appearing," your own docs should show up.

### 5. Include the Deployment Architecture
This was my breakthrough. A simple diagram showing:
```
Sanity Studio (separate deploy)
      ↓
   Sanity API
      ↓
Astro Site (separate deploy)
```

Once I drew this, everything clicked.

## What's Next

These guides have become living documents. Every time I add a component, I update the reference library. Every time I hit a gotcha, I add it to the troubleshooting section.

**Next up:** I'm planning to add:
- Video embed component (YouTube/Vimeo)
- Callout boxes (warnings, tips, notes)
- Two-column layouts for comparisons

And thanks to my documentation, each one should take about an hour instead of half a day.

---

## Try It Yourself

If you're building with a headless CMS (Sanity, Strapi, Contentful, etc.) or any two-part architecture, I challenge you to:

1. **Document your deployment process** (30 minutes)
2. **Create a component checklist** (30 minutes)
3. **Build a reference library** as you add components (10 minutes per component)

Then measure your speed on the 4th component vs. the 1st.

I bet you'll see at least a 2x improvement.

---

**Resources:**
- [Full Component Adding Guide](https://github.com/j-romo/pbnj-blog/blob/main/docs/adding-custom-components-guide.md) (on GitHub)
- [Component Reference Library](https://github.com/j-romo/pbnj-blog/blob/main/docs/component-reference-library.md) (on GitHub)
- [peanutbutterandjelly.ai](https://peanutbutterandjelly.ai) (the blog this is all for)

**Want to see this in action?** Next post, I'll walk through building the chat conversation component—including the 3-style bubble system and why dark mode support matters.

---

*Have you documented your deployment process? What was your "aha" moment that made you finally write it down?*
