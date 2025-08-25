import {defineType} from 'sanity'

export default defineType({
  name: 'figure',
  title: 'Figure (Image + Meta)',
  type: 'object',
  fields: [
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: r => r.required().warning('Add alt text (or explain why empty)')
        }
      ]
    },
    {name: 'caption', type: 'string', title: 'Caption'},
    {name: 'attribution', type: 'string', title: 'Attribution'},
    {
      name: 'alignment',
      type: 'string',
      title: 'Alignment',
      initialValue: 'center',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
          {title: 'Wide', value: 'wide'},
          {title: 'Full', value: 'full'},
        ],
        layout: 'radio',
        direction: 'horizontal'
      }
    }
  ],
  preview: {
    select: {title: 'caption', media: 'image.asset', subtitle: 'image.alt'}
  }
})