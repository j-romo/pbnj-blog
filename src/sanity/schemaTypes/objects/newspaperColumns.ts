import { defineType } from 'sanity';

export default defineType({
  name: 'newspaperColumns',
  title: 'Newspaper Columns',
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
      description: 'Optional label or heading above the columns',
    },
    {
      name: 'leftAlign',
      title: 'Left Column Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'left',
    },
    {
      name: 'rightAlign',
      title: 'Right Column Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'left',
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
        title: label || 'Newspaper Columns',
        subtitle: `${leftPreview} | ${rightPreview}`,
      };
    },
  },
});
