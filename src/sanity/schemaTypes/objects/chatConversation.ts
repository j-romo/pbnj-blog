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
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'timestamp',
              title: 'Timestamp',
              type: 'string',
              description: 'Optional timestamp (e.g., "10:30 AM")',
            },
          ],
          preview: {
            select: {
              text: 'text',
              sender: 'sender',
              side: 'side',
            },
            prepare({ text, sender, side }) {
              const preview = text?.substring(0, 50) || 'Empty message';
              const senderLabel = sender ? `${sender}: ` : '';
              const sideIcon = side === 'left' ? '◄' : '►';
              return {
                title: `${sideIcon} ${senderLabel}${preview}`,
              };
            },
          },
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
  preview: {
    select: {
      messages: 'messages',
    },
    prepare({ messages }) {
      const messageCount = messages?.length || 0;
      return {
        title: 'Chat Conversation',
        subtitle: `${messageCount} message${messageCount !== 1 ? 's' : ''}`,
      };
    },
  },
});
