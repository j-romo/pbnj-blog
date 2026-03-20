import type {PresentationPluginOptions} from 'sanity/presentation'

export default {
  locations: {
    post: {
      resolve: (doc) => {
        const slug = doc?.slug?.current
        if (!slug) return null
        
        return {
          locations: [
            {
              title: doc?.title || 'Untitled',
              href: `/blog/${slug}`,
            },
          ],
        }
      },
      select: {
        title: 'title',
        slug: 'slug.current',
      },
    },
  },
} satisfies PresentationPluginOptions['resolve']