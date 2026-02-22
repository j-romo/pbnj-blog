import { defineType } from 'sanity';

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
              validation: (Rule) => Rule.required(),
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
            prepare({ title }) {
              return {
                title: title || 'Untitled accordion item',
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    },
    {
      name: 'allowMultipleOpen',
      title: 'Allow Multiple Items Open',
      type: 'boolean',
      initialValue: false,
      description: 'If enabled, multiple accordion items can be open at the same time',
    },
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      const itemCount = items?.length || 0;
      return {
        title: 'Accordion',
        subtitle: `${itemCount} item${itemCount !== 1 ? 's' : ''}`,
      };
    },
  },
});
