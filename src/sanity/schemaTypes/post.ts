// ./src/sanity/schemaTypes/post.ts
import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: 'Blog Post',
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: 'Title',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: 'Subtitle',
      type: "string",
      description: 'Optional subtitle to complement longer titles',
    }),
    defineField({
      name: "slug",
      title: 'Slug',
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true, // Enable cropping in Sanity Studio
      },
      fields: [
        {
          name: 'size',
          title: 'Size',
          type: 'string',
          options: {
            list: [
              { title: 'Small (40%)', value: 'small' },
              { title: 'Medium (70%)', value: 'medium' },
              { title: 'Large (100%)', value: 'large' },
              { title: 'Full Width', value: 'full' },
            ],
          },
          initialValue: 'large',
        },
      ],
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: 'pubDate',
      title: 'Publish Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },      // for rich text
        { 
          type: 'image', 
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Important for accessibility and SEO',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
            {
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Small (40%)', value: 'small' },
                  { title: 'Medium (70%)', value: 'medium' },
                  { title: 'Large (100%)', value: 'large' },
                ],
              },
              initialValue: 'medium',
            },
            {
              name: 'alignment',
              title: 'Alignment',
              type: 'string',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Center', value: 'center' },
                  { title: 'Right', value: 'right' },
                ],
              },
              initialValue: 'center',
            },
          ],
        },
        { type: 'table' },      // for tables
        { type: 'divider' },    // for dividers
        { type: 'accordion' },  // for accordions
        { type: 'codeBlock' },  // for code blocks
        { type: 'chatConversation' },  // for chat conversations
        { type: 'containerColumns' },  // for two-column text comparisons (boxed)
        { type: 'newspaperColumns' },  // for newspaper-style columns (plain)
        { type: 'handwrittenNote' },  // for handwritten notes
      ],
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "heroImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});