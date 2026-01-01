# Custom Component Reference Library

**Date Created:** January 1, 2026  
**Last Updated:** January 1, 2026

This is a reference guide for custom block components that can be added to your Sanity Studio CMS. Use this alongside the [How to Add Custom Components Guide](./adding-custom-components-guide.md) to implement these in your blog.

## Currently Implemented Components

### ✅ Image (Built-in)
**Type:** `image`  
**Location:** Built into Sanity  
**Features:** Hotspot cropping, alt text, captions, alignment options

### ✅ Figure
**Type:** `figure`  
**Location:** `src/sanity/schemaTypes/objects/figure.ts`  
**Features:** Enhanced image with metadata, attribution, and layout options

### ✅ Table
**Type:** `table`  
**Location:** `src/sanity/schemaTypes/objects/table.ts`  
**Features:** 
- Dynamic rows and columns
- Optional header row
- Captions
- Responsive design
- Hover effects

**Schema:**
```typescript
export default defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    {
      name: 'rows',
      type: 'array',
      of: [{ 
        type: 'object',
        fields: [{ name: 'cells', type: 'array', of: [{ type: 'string' }] }]
      }]
    },
    { name: 'caption', type: 'string' },
    { name: 'hasHeader', type: 'boolean', initialValue: true }
  ]
});
```

---

## Available Components to Add

### 📝 Content Components

#### Code Block
**Use Case:** Displaying syntax-highlighted code snippets  
**Complexity:** Medium  
**Dependencies:** Prism.js or Shiki for highlighting

```typescript
// src/sanity/schemaTypes/objects/codeBlock.ts
export default defineType({
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    {
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 10,
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'Python', value: 'python' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'JSON', value: 'json' },
          { title: 'Markdown', value: 'markdown' },
          { title: 'Bash', value: 'bash' },
        ],
      },
      initialValue: 'javascript',
    },
    {
      name: 'filename',
      title: 'Filename',
      type: 'string',
      description: 'Optional filename to display',
    },
    {
      name: 'highlightLines',
      title: 'Highlight Lines',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Line numbers to highlight (e.g., [1, 3, 5])',
    },
    {
      name: 'showLineNumbers',
      title: 'Show Line Numbers',
      type: 'boolean',
      initialValue: true,
    },
  ],
});
```

#### Callout/Alert Box
**Use Case:** Highlighting important information, warnings, tips  
**Complexity:** Easy  
**Visual Impact:** High

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
          { title: '💡 Info', value: 'info' },
          { title: '⚠️ Warning', value: 'warning' },
          { title: '✅ Success', value: 'success' },
          { title: '❌ Error', value: 'error' },
          { title: '💭 Note', value: 'note' },
          { title: '🔥 Tip', value: 'tip' },
        ],
      },
      initialValue: 'info',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional heading',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 3,
    },
  ],
  preview: {
    select: { type: 'type', title: 'title', content: 'content' },
    prepare({ type, title, content }) {
      return {
        title: title || type.toUpperCase(),
        subtitle: content,
      };
    },
  },
});
```

#### Block Quote (Enhanced)
**Use Case:** Quotations with attribution and source links  
**Complexity:** Easy

```typescript
// src/sanity/schemaTypes/objects/blockQuote.ts
export default defineType({
  name: 'blockQuote',
  title: 'Block Quote',
  type: 'object',
  fields: [
    {
      name: 'quote',
      title: 'Quote Text',
      type: 'text',
      rows: 4,
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
    },
    {
      name: 'authorTitle',
      title: 'Author Title/Role',
      type: 'string',
      description: 'e.g., "CEO of Company"',
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'e.g., "Interview with TechCrunch"',
    },
    {
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
    },
  ],
});
```

---

### 🎥 Media Components

#### Video Embed
**Use Case:** YouTube, Vimeo, or self-hosted videos  
**Complexity:** Medium  
**Performance:** Consider lazy loading

```typescript
// src/sanity/schemaTypes/objects/videoEmbed.ts
export default defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  fields: [
    {
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or direct video URL',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
    {
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9 (Standard)', value: '16/9' },
          { title: '4:3', value: '4/3' },
          { title: '21:9 (Ultrawide)', value: '21/9' },
          { title: '9:16 (Vertical)', value: '9/16' },
        ],
      },
      initialValue: '16/9',
    },
    {
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: false,
    },
  ],
});
```

#### Audio Player
**Use Case:** Podcasts, music, audio samples  
**Complexity:** Medium

```typescript
// src/sanity/schemaTypes/objects/audioPlayer.ts
export default defineType({
  name: 'audioPlayer',
  title: 'Audio Player',
  type: 'object',
  fields: [
    {
      name: 'audioFile',
      title: 'Audio File',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    },
    {
      name: 'transcript',
      title: 'Transcript',
      type: 'text',
      rows: 5,
      description: 'Full text transcript for accessibility',
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "12:34"',
    },
  ],
});
```

#### Image Gallery
**Use Case:** Multiple related images, before/after comparisons  
**Complexity:** Medium to Hard

```typescript
// src/sanity/schemaTypes/objects/imageGallery.ts
export default defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Masonry', value: 'masonry' },
          { title: 'Slideshow', value: 'slideshow' },
        ],
      },
      initialValue: 'grid',
    },
    {
      name: 'columns',
      title: 'Columns (for grid)',
      type: 'number',
      initialValue: 3,
      hidden: ({ parent }) => parent?.layout !== 'grid',
    },
  ],
});
```

---

### 🎨 Interactive Components

#### Accordion/Collapsible
**Use Case:** FAQs, expandable content sections  
**Complexity:** Medium  
**UX Impact:** Improves scannability

```typescript
// src/sanity/schemaTypes/objects/accordion.ts
export default defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'object',
  fields: [
    {
      name: 'items',
      title: 'Accordion Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'accordionItem',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }],
            },
            {
              name: 'defaultOpen',
              title: 'Open by Default',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    },
    {
      name: 'allowMultipleOpen',
      title: 'Allow Multiple Items Open',
      type: 'boolean',
      initialValue: false,
    },
  ],
});
```

#### Tabs
**Use Case:** Organizing related content (e.g., code examples in different languages)  
**Complexity:** Hard

```typescript
// src/sanity/schemaTypes/objects/tabs.ts
export default defineType({
  name: 'tabs',
  title: 'Tabs',
  type: 'object',
  fields: [
    {
      name: 'tabs',
      title: 'Tab Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tab',
          fields: [
            {
              name: 'label',
              title: 'Tab Label',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Tab Content',
              type: 'array',
              of: [{ type: 'block' }, { type: 'codeBlock' }],
            },
          ],
          preview: {
            select: { title: 'label' },
          },
        },
      ],
      validation: (Rule) => Rule.min(2).max(6),
    },
  ],
});
```

#### Button/CTA
**Use Case:** Call-to-action links, downloads  
**Complexity:** Easy

```typescript
// src/sanity/schemaTypes/objects/button.ts
export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required().max(50),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
          { title: 'Text Link', value: 'link' },
        ],
      },
      initialValue: 'primary',
    },
    {
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: ['small', 'medium', 'large'],
      },
      initialValue: 'medium',
    },
    {
      name: 'openNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
    },
  ],
});
```

---

### 🔧 Technical Components

#### Math Equation
**Use Case:** Mathematical or scientific content  
**Complexity:** Medium  
**Dependencies:** KaTeX or MathJax

```typescript
// src/sanity/schemaTypes/objects/mathEquation.ts
export default defineType({
  name: 'mathEquation',
  title: 'Math Equation',
  type: 'object',
  fields: [
    {
      name: 'equation',
      title: 'LaTeX Equation',
      type: 'text',
      rows: 3,
      description: 'Enter LaTeX syntax (e.g., E = mc^2)',
    },
    {
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Inline', value: 'inline' },
          { title: 'Block (Centered)', value: 'block' },
        ],
      },
      initialValue: 'block',
    },
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Optional label (e.g., "Equation 1")',
    },
  ],
});
```

#### Mermaid Diagram
**Use Case:** Flowcharts, diagrams, sequence diagrams  
**Complexity:** Medium  
**Dependencies:** Mermaid.js

```typescript
// src/sanity/schemaTypes/objects/mermaidDiagram.ts
export default defineType({
  name: 'mermaidDiagram',
  title: 'Mermaid Diagram',
  type: 'object',
  fields: [
    {
      name: 'code',
      title: 'Mermaid Code',
      type: 'text',
      rows: 10,
      description: 'Mermaid diagram syntax',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
    {
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: ['default', 'dark', 'forest', 'neutral'],
      },
      initialValue: 'default',
    },
  ],
});
```

#### GitHub Gist
**Use Case:** Embedding code snippets from GitHub  
**Complexity:** Easy

```typescript
// src/sanity/schemaTypes/objects/gistEmbed.ts
export default defineType({
  name: 'gistEmbed',
  title: 'GitHub Gist',
  type: 'object',
  fields: [
    {
      name: 'gistId',
      title: 'Gist ID',
      type: 'string',
      description: 'The alphanumeric ID from the Gist URL',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'file',
      title: 'Specific File',
      type: 'string',
      description: 'Optional: specify a single file from a multi-file gist',
    },
  ],
});
```

---

### 📱 Social Media Components

#### Tweet Embed
**Use Case:** Embedding tweets in blog posts  
**Complexity:** Easy to Medium  
**Dependencies:** Twitter embed script

```typescript
// src/sanity/schemaTypes/objects/tweetEmbed.ts
export default defineType({
  name: 'tweetEmbed',
  title: 'Tweet Embed',
  type: 'object',
  fields: [
    {
      name: 'tweetUrl',
      title: 'Tweet URL',
      type: 'url',
      description: 'Full URL to the tweet',
      validation: (Rule) =>
        Rule.required().custom((url) => {
          if (!url) return true;
          return url.includes('twitter.com') || url.includes('x.com')
            ? true
            : 'Must be a valid Twitter/X URL';
        }),
    },
    {
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: ['light', 'dark'],
      },
      initialValue: 'light',
    },
    {
      name: 'hideConversation',
      title: 'Hide Conversation',
      type: 'boolean',
      initialValue: false,
    },
  ],
});
```

#### Instagram Post
**Use Case:** Embedding Instagram posts  
**Complexity:** Easy

```typescript
// src/sanity/schemaTypes/objects/instagramEmbed.ts
export default defineType({
  name: 'instagramEmbed',
  title: 'Instagram Post',
  type: 'object',
  fields: [
    {
      name: 'postUrl',
      title: 'Instagram Post URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required().custom((url) => {
          if (!url) return true;
          return url.includes('instagram.com')
            ? true
            : 'Must be a valid Instagram URL';
        }),
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption to display below',
    },
  ],
});
```

---

### 📐 Layout Components

#### Two Column Layout
**Use Case:** Side-by-side content, comparisons  
**Complexity:** Hard  
**Responsive Considerations:** High

```typescript
// src/sanity/schemaTypes/objects/twoColumn.ts
export default defineType({
  name: 'twoColumn',
  title: 'Two Column Layout',
  type: 'object',
  fields: [
    {
      name: 'leftColumn',
      title: 'Left Column',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    },
    {
      name: 'rightColumn',
      title: 'Right Column',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    },
    {
      name: 'ratio',
      title: 'Column Ratio',
      type: 'string',
      options: {
        list: [
          { title: '50% / 50%', value: '1:1' },
          { title: '60% / 40%', value: '3:2' },
          { title: '70% / 30%', value: '2:1' },
          { title: '40% / 60%', value: '2:3' },
        ],
      },
      initialValue: '1:1',
    },
  ],
});
```

#### Divider/Separator
**Use Case:** Visual breaks between sections  
**Complexity:** Easy

```typescript
// src/sanity/schemaTypes/objects/divider.ts
export default defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  fields: [
    {
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: '─── Solid', value: 'solid' },
          { title: '- - - Dashed', value: 'dashed' },
          { title: '· · · Dotted', value: 'dotted' },
          { title: '••• Dots', value: 'dots' },
          { title: '✦ ✦ ✦ Stars', value: 'stars' },
          { title: '🌊 Wave', value: 'wave' },
        ],
      },
      initialValue: 'solid',
    },
    {
      name: 'spacing',
      title: 'Spacing',
      type: 'string',
      options: {
        list: ['small', 'medium', 'large'],
      },
      initialValue: 'medium',
    },
  ],
});
```

---

## Implementation Priority Guide

### Quick Wins (Easy + High Impact)
1. ✅ **Callout Box** - Very useful, easy to implement
2. ✅ **Button/CTA** - Simple and effective
3. ✅ **Divider** - Quick visual improvement
4. ✅ **Block Quote** - Common need, easy setup

### Medium Priority (Medium Complexity, Good Value)
1. **Code Block** - Essential for technical content
2. **Video Embed** - High engagement
3. **Accordion** - Great for FAQs
4. **Image Gallery** - Visual content enhancement

### Advanced (High Complexity, Specific Use Cases)
1. **Tabs** - Complex but powerful
2. **Two Column Layout** - Requires careful responsive design
3. **Mermaid Diagram** - Technical audience only
4. **Math Equations** - Niche use case

---

## Notes for Implementation

- Always start with the simplest version, then add features
- Test responsive behavior on mobile devices
- Consider accessibility (ARIA labels, keyboard navigation)
- Add preview functionality in Sanity Studio for better UX
- Document each component's props and usage in code comments

## Related Resources

- [How to Add Custom Components Guide](./adding-custom-components-guide.md)
- [Sanity Schema Types Documentation](https://www.sanity.io/docs/schema-types)
- [Portable Text Specification](https://github.com/portabletext/portabletext)
