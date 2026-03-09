import { defineType } from 'sanity';

export default defineType({
  name: 'handwrittenNote',
  title: 'Handwritten Note',
  type: 'object',
  fields: [
    {
      name: 'content',
      title: 'Note Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
          ],
          lists: [
            { title: 'Bullet (Dashes)', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'style',
      title: 'Note Style',
      type: 'string',
      options: {
        list: [
          { title: '📝 Post-it Note', value: 'postit' },
          { title: '📔 Field Notes', value: 'fieldnotes' },
          { title: '📓 Notebook Page', value: 'notebook' },
        ],
        layout: 'radio',
      },
      initialValue: 'postit',
    },
    {
      name: 'colorVariant',
      title: 'Color Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Yellow', value: 'yellow' },
          { title: 'Cream', value: 'cream' },
          { title: 'Light Gray', value: 'gray' },
          { title: 'Light Blue', value: 'blue' },
          { title: 'Light Green', value: 'green' },
        ],
      },
      initialValue: 'yellow',
      hidden: ({ parent }: any) => parent?.style === 'postit' || parent?.style === 'notebook',
    },
  ],
  preview: {
    select: {
      style: 'style',
      colorVariant: 'colorVariant',
      blocks: 'content',
    },
    prepare({ style, colorVariant, blocks }: any) {
      const styleMap = {
        postit: '📝 Post-it',
        fieldnotes: '📔 Field Notes',
        notebook: '📓 Notebook',
      };
      
      // Get first line of content for preview
      const block = (blocks || [])[0];
      const text = block?.children?.[0]?.text || 'Empty note'; 
      const preview = text.length > 50 ? text.substring(0, 50) + '...' : text;
      
      return {
        title: `${styleMap[style as keyof typeof styleMap] || 'Handwritten Note'}`,
        subtitle: `${colorVariant || ''} - ${preview}`,
      };
    },
  },
});
