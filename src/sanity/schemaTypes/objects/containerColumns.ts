import { defineType } from 'sanity';

export default defineType({
  name: 'containerColumns',
  title: 'Container Columns',
  type: 'object',
  fields: [
    {
      name: 'leftText',
      title: 'Left Column',
      type: 'text',
      rows: 10,
      description: 'Content for the left column',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'rightText',
      title: 'Right Column',
      type: 'text',
      rows: 10,
      description: 'Content for the right column',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Optional label or heading for this comparison (e.g., "English | Spanish")',
    },
  ],
  preview: {
    select: {
      label: 'label',
      leftText: 'leftText',
      rightText: 'rightText',
    },
    prepare({ label, leftText, rightText }) {
      const leftPreview = leftText ? leftText.substring(0, 30) + '...' : 'Empty';
      const rightPreview = rightText ? rightText.substring(0, 30) + '...' : 'Empty';
      return {
        title: label || 'Container Columns',
        subtitle: `${leftPreview} | ${rightPreview}`,
      };
    },
  },
});
