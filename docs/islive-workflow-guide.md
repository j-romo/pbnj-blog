# isLive Feature - iPad-Friendly Draft Preview

## ✨ What This Does

You can now:
- ✅ **Publish posts in Sanity** (so they build as pages)
- ✅ **Hide them from blog listing** with `isLive: false`
- ✅ **Preview them from iPad** using Presentation Tool or direct URL
- ✅ **Make them live** by toggling `isLive: true`
- ✅ **Hide published posts temporarily** by toggling back to false

Think of it as: **Publish = Build the page, isLive = Show in listing**

## 🔧 How It Works

### New Field in Post Schema

Every blog post now has an **"Is Live"** toggle:
- `isLive: true` (default) → Shows in blog listing  
- `isLive: false` → Hidden from blog, but page exists

### What Changes:

**Blog Listing** (`/blog`):
- Only shows posts with `isLive: true`
- Hidden posts don't appear in the list

**Individual Post Pages** (`/blog/my-post`):
- Work for ALL published posts
- Even if `isLive: false`, direct URL works!

**Presentation Tool**:
- Works for ALL published posts
- Preview any post regardless of isLive status

## 📱 iPad Workflow

### Writing a New Post:

1. **Open Studio** on iPad:  
   https://pbnj-blog-cms.sanity.studio

2. **Create New Post**:
   - Add title, content, etc.
   - Set `isLive: false` (keeps it hidden)
   - Click **"Publish"** (yes, publish it!)

3. **Preview from iPad**:
   
   **Option A - Presentation Tool:**
   - Click the Presentation icon (monitor screen)
   - See your post rendered on the site
   - Edit and see changes in split-screen
   
   **Option B - Direct URL:**
   - Your slug: `my-new-post`
   - Visit: `https://peanutbutterandjelly.ai/blog/my-new-post`
   - Page works even though hidden from listing!

4. **When Ready to Go Live**:
   - Toggle `isLive: true`
   - Click "Publish" to save
   - Post now appears in blog listing!

### Editing Published Posts:

1. Open post in Studio
2. Make your edits
3. Preview in Presentation Tool
4. Publish when satisfied

### Taking Posts Offline Temporarily:

1. Open post in Studio
2. Toggle `isLive: false`
3. Publish
4. Post disappears from blog (but URL still works)

## 🚀 Deployment Steps

### Step 1: Deploy Schema Update

Run this in your terminal to update the Studio schema:

```bash
npx sanity deploy
```

This deploys the schema changes to https://pbnj-blog-cms.sanity.studio

### Step 2: Update Existing Posts

Go to each existing post in Studio and:
- The `isLive` field will appear
- It defaults to `true` (so nothing changes)
- Publish each post to save the field

Or they'll automatically get `isLive: true` by default!

### Step 3: Deploy Blog Code

Commit and push your changes to trigger GitHub Actions:

```bash
git add .
git commit -m "Add isLive field for draft preview workflow"
git push origin feature-preview-drafts
```

Then merge to `main` to deploy.

### Step 4: Add Production URL to Sanity CORS

Make sure your production URL is in CORS (you already have this!):
- https://peanutbutterandjelly.ai ✅

## 🧪 Testing

### Test on Desktop First:

1. **Local Dev**:
   ```bash
   npm run dev
   npx sanity dev  # in another terminal
   ```

2. **Create Test Post**:
   - In Studio, create a post
   - Set `isLive: false`
   - Publish it

3. **Check Blog Listing**:
   - Go to http://localhost:4321/blog
   - Should NOT see your test post

4. **Check Direct URL**:
   - Go to http://localhost:4321/blog/your-slug
   - SHOULD see your post!

5. **Toggle isLive**:
   - Set `isLive: true` and publish
   - Refresh blog listing
   - Post now appears!

### Test on iPad:

1. **Open Studio**:
   https://pbnj-blog-cms.sanity.studio

2. **Create Post** with `isLive: false`

3. **Preview**:
   - Use Presentation Tool, OR
   - Direct URL in Safari

4. **Verify** it's hidden from main blog listing

## 🎯 Use Cases

### 1. Writing Workflow
- Write posts with `isLive: false`
- Preview and edit
- Publish when ready

### 2. Scheduled Posts
- Publish with `isLive: false`
- Share direct URL with team for review
- Toggle `isLive: true` on launch day

### 3. Temporary Removal
- Need to update a post?
- Set `isLive: false` to hide it
- Make edits
- Set back to `true`

### 4. Seasonal Content
- Holiday posts: `isLive: true` during season
- Off-season: `isLive: false` (but keep the content)

## ⚠️ Important Notes

### The "Publish" Button Confusion

In this workflow:
- **Sanity "Publish"** = Make content available to API (builds the page)
- **`isLive` toggle** = Show/hide from blog listing

You need to:
1. Click "Publish" in Sanity (even for "hidden" posts)
2. Set `isLive: false` to keep it hidden
3. The page exists but won't show in listings

### Pages Build on Deploy

Remember:
- Changes trigger GitHub Actions rebuild
- Takes a few minutes for pages to update
- Preview in Presentation Tool shows latest immediately
- Production site updates after rebuild completes

### Direct URLs Are "Unlisted"

Just like unlisted YouTube videos:
- Anyone with the link can view
- Won't appear in search/listings
- Not truly "private" (no password)

If you need true privacy, you'd need authentication (more complex).

## 🆘 Troubleshooting

### Field doesn't appear in Studio
- Run `npx sanity deploy` to update schema
- Hard refresh Studio (Cmd+Shift+R)
- Check browser console for errors

### Post still shows in blog listing
-  Verify `isLive: false` is saved
- Check you clicked "Publish" after toggling
- Redeploy site (push to main branch)

### Direct URL returns 404
- Make sure post is Published in Sanity
- Check slug is correct
- Verify site rebuild completed

### Presentation Tool doesn't work
- Check CORS settings in Sanity
- Verify production URL in sanity.config.ts
- Try hard refresh in Studio

## ✅ Summary

You now have a simple draft preview system:
- Write on iPad in Sanity Studio ✅
- Preview from iPad (Presentation Tool or direct URL) ✅  
- Control visibility with simple toggle ✅
- No separate preview hosting needed ✅
- Works with your existing GitHub Pages setup ✅

**Next**: Deploy schema, test with one post, then start writing from your iPad!
