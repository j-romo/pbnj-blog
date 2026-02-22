import { defineType } from 'sanity';

export default defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    {
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'row',
          fields: [
            {
              name: 'cells',
              title: 'Row Cells',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: {
              cells: 'cells',
            },
            prepare({ cells }) {
              return {
                title: cells ? cells.join(' | ') : 'Empty row',
              };
            },
          },
        },
      ],
    },
    {
      name: 'caption',
      title: 'Table Caption',
      type: 'string',
      description: 'Optional caption for the table',
    },
    {
      name: 'hasHeader',
      title: 'First Row is Header',
      type: 'boolean',
      initialValue: true,
      description: 'If checked, the first row will be styled as a header',
    },
  ],
  preview: {
    select: {
      caption: 'caption',
      rows: 'rows',
    },
    prepare({ caption, rows }) {
      const rowCount = rows?.length || 0;
      return {
        title: caption || 'Table',
        subtitle: `${rowCount} rows`,
      };
    },
  },
});
