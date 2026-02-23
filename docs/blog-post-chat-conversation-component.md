# Building a Chat Conversation Component for Sanity Studio (iMessage-Style Bubbles)

**Published:** February 22, 2026  
**Tags:** Sanity CMS, Astro, UI Components, React, Web Development

---

Ever wanted to embed a conversation or chat screenshot in your blog post, but pasting an image felt too static? What if you could recreate chat bubbles—complete with sender names, timestamps, and multiple visual styles—as structured content?

That's what I built for my [Astro + Sanity blog](https://peanutbutterandjelly.ai). And thanks to [the documentation system I built](./blog-post-documentation-driven-components.md), it only took 90 minutes from concept to production.

Here's how it works, what design decisions went into it, and the complete implementation guide.

## The Problem: Conversations Are Hard to Present

I wanted to share some ChatGPT conversations and WhatsApp exchanges in blog posts. My options were:

1. **Screenshots** - Static, not accessible, can't copy text, breaks on different screen sizes
2. **Blockquotes** - Doesn't convey the back-and-forth nature
3. **Custom HTML** - Works once, painful to reuse

What I really wanted:
- Message bubbles that look like actual chat apps
- Different colors for different speakers
- Optional sender names and timestamps  
- Multiple visual styles (iMessage, WhatsApp, minimal)
- Mobile-friendly and accessible
- Easy to create in Sanity Studio (no code required per conversation)

## The Solution: A Structured Chat Component

Here's what the final component looks like in action:

```
┌─────────────────────────────────────────┐
│  Alice                                  │
│  ┌──────────────────────────────┐      │
│  │ Hey, did you finish the docs?│      │
│  │ 10:30 AM                      │      │
│  └──────────────────────────────┘      │
│                                         │
│                    ┌──────────────────┐ │
│                    │ Just pushed them!│ │
│                    │ 10:32 AM         │ │
│                    └──────────────────┘ │
│                                      Bob│
└─────────────────────────────────────────┘
```

**Three visual styles:**
- **Modern** (iMessage-style): Blue bubbles on the right, gray on the left
- **Classic** (WhatsApp-style): Green bubbles with borders
- **Minimal**: No bubbles, just border lines and alignment

## The Schema: Structured Conversation Data

First, I defined the Sanity schema in `src/sanity/schemaTypes/objects/chatConversation.ts`:

```typescript
import { defineType } from 'sanity';

export default defineType({
  name: 'chatConversation',
  title: 'Chat Conversation',
  type: 'object',
  fields: [
    {
      name: 'messages',
      title: 'Messages',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'message',
          fields: [
            {
              name: 'text',
              title: 'Message Text',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'sender',
              title: 'Sender',
              type: 'string',
              description: 'Name of the sender (e.g., "User", "Assistant", "Alice")',
            },
            {
              name: 'side',
              title: 'Side',
              type: 'string',
              options: {
                list: [
                  { title: 'Left (Gray)', value: 'left' },
                  { title: 'Right (Blue)', value: 'right' },
                ],
              },
              initialValue: 'right',
            },
            {
              name: 'timestamp',
              title: 'Timestamp',
              type: 'string',
              description: 'Optional timestamp (e.g., "10:30 AM")',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).required(),
    },
    {
      name: 'style',
      title: 'Chat Style',
      type: 'string',
      options: {
        list: [
          { title: 'Modern (Like iMessage)', value: 'modern' },
          { title: 'Classic (Like WhatsApp)', value: 'classic' },
          { title: 'Minimal', value: 'minimal' },
        ],
      },
      initialValue: 'modern',
    },
  ],
});
```

### Design Decision: Why Three Styles?

**Modern (iMessage):** 
- Familiar to iOS users
- High contrast with blue/gray
- Clean, rounded bubbles

**Classic (WhatsApp):**
- Green bubbles feel friendly
- Border/shadow gives depth
- Recognizable across platforms

**Minimal:**
- Perfect for technical content
- No visual clutter
- Just colored border lines

This gives content creators flexibility depending on the tone of their post.

## The Renderer: Astro Component with Dynamic Styling

Next, the Astro component (`src/components/PortableTextChatConversation.astro`):

```astro
---
const { node } = Astro.props;
const { messages, style = 'modern' } = node;
---

<div class={`chat-conversation chat-${style}`}>
  {messages.map((message: any) => {
    const { text, sender, side = 'right', timestamp } = message;
    
    return (
      <div class={`chat-message-wrapper ${side}`}>
        {sender && side === 'left' && (
          <div class="chat-sender-name">{sender}</div>
        )}
        <div class={`chat-bubble ${side}`}>
          <div class="chat-text">{text}</div>
          {timestamp && (
            <div class="chat-timestamp">{timestamp}</div>
          )}
        </div>
        {sender && side === 'right' && (
          <div class="chat-sender-name right">{sender}</div>
        )}
      </div>
    );
  })}
</div>
```

### Key CSS Patterns

**Modern Style (iMessage):**
```css
.chat-modern .chat-bubble.left {
  background: #e5e7eb;  /* Gray */
  color: #111827;
  border-bottom-left-radius: 4px;  /* Tail effect */
}

.chat-modern .chat-bubble.right {
  background: #3b82f6;  /* Blue */
  color: white;
  border-bottom-right-radius: 4px;
}
```

**Classic Style (WhatsApp):**
```css
.chat-classic .chat-bubble.right {
  background: #dcf8c6;  /* Light green */
  color: #111827;
  border: 1px solid #c3e6a8;
}
```

**Minimal Style:**
```css
.chat-minimal .chat-bubble.left {
  background: transparent;
  border-left: 3px solid #9ca3af;
  border-radius: 0;
}
```

## The Mobile Experience

Chat bubbles need to work on phones. Here's how:

```css
@media (max-width: 768px) {
  .chat-bubble {
    max-width: 85%;  /* More screen space on mobile */
    padding: 0.65rem 0.85rem;
    font-size: 0.9rem;
  }
}
```

On desktop, bubbles max out at 75% width. On mobile, they expand to 85% to use the limited space better.

## Dark Mode Support

Because people read blogs at night:

```css
@media (prefers-color-scheme: dark) {
  .chat-conversation {
    background: #1f2937;  /* Dark container */
  }

  .chat-modern .chat-bubble.left {
    background: #374151;  /* Darker gray */
    color: #f3f4f6;
  }
}
```

The blue bubbles stay blue in dark mode—they already have good contrast.

## Accessibility Considerations

1. **Sender names above/below bubbles** - Screen readers announce who's speaking
2. **Semantic HTML** - Uses `<div>` with proper roles, not `<ul>` (conversations aren't lists)
3. **Color isn't the only indicator** - Side alignment also shows who's speaking
4. **Text is selectable** - Users can copy conversation text

## Using It in Sanity Studio

The editor experience is dead simple:

1. Click "Chat Conversation" in the body editor
2. Add messages one by one:
   - Type the message text
   - Choose "Left" or "Right"
   - Optionally add sender name
   - Optionally add timestamp
3. Select the chat style
4. Publish!

**Preview in Studio:**
```
Chat Conversation
2 messages
```

Each message shows a preview:
```
► User: Hey, did you finish the docs?
```

## Real-World Example

Here's how I used it to share a ChatGPT conversation:

**Message 1 (Left):**
- Sender: "User"
- Text: "How do I add custom components to Sanity?"
- Timestamp: "2:30 PM"

**Message 2 (Right):**
- Sender: "ChatGPT"  
- Text: "You'll need to create a schema file, register it, and build a renderer component..."
- Timestamp: "2:31 PM"

**Message 3 (Left):**
- Sender: "User"
- Text: "Wait, do I need to deploy twice?"

And so on. The result looks like an actual chat interface, but it's structured data that's:
- Searchable
- Accessible
- Responsive
- Copy-pasteable
- Version-controlled

## Performance Notes

**Bundle Size:**
- No external dependencies
- Pure CSS styling
- ~3KB compressed

**Rendering:**
- Static HTML (built at compile time with Astro)
- No JavaScript needed for display
- No API calls

## What I'd Do Differently

**If I built this again, I'd add:**

1. **Avatar images** - Small profile pics next to sender names
2. **Typing indicator animation** - For dramatic effect in tutorials
3. **Read receipts** - Blue checkmarks like WhatsApp
4. **Reactions** - Emoji reactions to messages
5. **Group chat support** - More than two participants

But for v1, the current feature set covers 90% of my use cases.

## The 90-Minute Timeline

Thanks to [my documentation system](./blog-post-documentation-driven-components.md), here's how the build broke down:

- **Schema design:** 15 minutes
- **Basic renderer:** 30 minutes
- **Three style variants:** 25 minutes
- **Mobile/dark mode:** 15 minutes
- **Testing & polish:** 5 minutes

**Total: 90 minutes from idea to production.**

The guides eliminated all the "wait, how do I..." moments. I knew exactly:
- Where to put the schema
- How to structure the component
- What the deployment steps were
- Common pitfalls to avoid

## Try It Yourself

Want to add this to your own Sanity + Astro blog?

1. Copy the schema from this post
2. Copy the Astro component
3. Register both following [this guide](./adding-custom-components-guide.md)
4. Deploy and enjoy!

Or customize it:
- Change the bubble colors
- Add your own style variant
- Modify the border radius
- Add animations

## What Would You Build?

This chat component scratched my itch for displaying conversations. But the pattern works for tons of other use cases:

- **Email thread viewer** (Gmail-style)
- **Comment sections** (Reddit-style)  
- **Code review threads** (GitHub-style)
- **Twitter/X thread embeds** (X-style)

What conversations do you want to display in your blog?

---

**Full Code:**
- [Chat Schema](https://github.com/j-romo/pbnj-blog/blob/main/src/sanity/schemaTypes/objects/chatConversation.ts)
- [Chat Renderer](https://github.com/j-romo/pbnj-blog/blob/main/src/components/PortableTextChatConversation.astro)
- [Component Adding Guide](https://github.com/j-romo/pbnj-blog/blob/main/docs/adding-custom-components-guide.md)

**See it live:**
- [peanutbutterandjelly.ai](https://peanutbutterandjelly.ai) (check the latest posts)

---

*Building custom Sanity components? Running into deployment gotchas? Let's chat about it.*
