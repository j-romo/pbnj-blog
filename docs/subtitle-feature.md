# Blog Post Subtitle Feature

The subtitle feature allows you to add a complementary subtitle to your blog posts, which is particularly useful for lengthy titles. The subtitle displays with a smaller font size and lighter color below the main title.

## Using Subtitles in Markdown Posts

Add a `subtitle` field to your frontmatter:

```markdown
---
title: 'Your Main Title'
subtitle: 'Your optional subtitle for additional context'
description: 'Post description'
pubDate: 'Jan 01 2024'
heroImage: '/image.jpg'
---

Your content here...
```

## Using Subtitles in Sanity CMS Posts

When creating or editing a post in Sanity Studio, you'll find a new "Subtitle" field below the Title field. This field is optional and can be used to provide additional context or break up lengthy titles.

## Styling

The subtitle is styled with:
- Font size: 1.8rem (smaller than the main title's 2.5rem)
- Color: Gray-dark (darker gray for better readability)
- Font weight: 600 (semi-bold)
- Spacing: Positioned close to the title with proper margin

## Example Use Cases

1. **Long Titles**: Break a lengthy title into a punchy main title and descriptive subtitle
   - Title: "Building Modern Web Apps"
   - Subtitle: "A comprehensive guide to full-stack development with Astro and Sanity"

2. **Emphasis**: Emphasize the key message in the title, provide context in subtitle
   - Title: "We're Going Carbon Neutral"
   - Subtitle: "Our commitment to sustainability by 2024"

3. **Series Posts**: Indicate series information
   - Title: "React Patterns Deep Dive"
   - Subtitle: "Part 3: Custom Hooks and State Management"
