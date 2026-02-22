import { defineType } from 'sanity';

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
      validation: (Rule) => Rule.required(),
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
          { title: 'SQL', value: 'sql' },
          { title: 'YAML', value: 'yaml' },
          { title: 'Rust', value: 'rust' },
          { title: 'Go', value: 'go' },
          { title: 'Java', value: 'java' },
          { title: 'C++', value: 'cpp' },
          { title: 'PHP', value: 'php' },
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
  preview: {
    select: {
      code: 'code',
      language: 'language',
      filename: 'filename',
    },
    prepare({ code, language, filename }) {
      const preview = code?.split('\n')[0] || 'Empty code block';
      const truncated = preview.length > 50 ? preview.substring(0, 50) + '...' : preview;
      return {
        title: filename || `Code: ${language}`,
        subtitle: truncated,
      };
    },
  },
});
