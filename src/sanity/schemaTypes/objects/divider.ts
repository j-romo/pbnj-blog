import { defineType } from 'sanity';

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
  preview: {
    select: {
      style: 'style',
      spacing: 'spacing',
    },
    prepare({ style, spacing }) {
      const styleMap = {
        solid: '───',
        dashed: '- - -',
        dotted: '· · ·',
        dots: '•••',
        stars: '✦ ✦ ✦',
        wave: '🌊',
      };
      return {
        title: `Divider: ${styleMap[style as keyof typeof styleMap] || style}`,
        subtitle: `${spacing} spacing`,
      };
    },
  },
});
