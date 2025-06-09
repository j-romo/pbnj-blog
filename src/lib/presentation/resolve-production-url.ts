import type {PresentationPluginOptions} from 'sanity/presentation'

const resolveProductionUrl: PresentationPluginOptions['resolve'] = {
  locations: {
    post: {
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/blog/${doc?.slug?.current}`,
          },
        ],
      }),
      select: {
        title: 'title',
        slug: 'slug.current',
      },
    },
    page: {
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/${doc?.slug?.current}`,
          },
        ],
      }),
      select: {
        title: 'title', 
        slug: 'slug.current',
      },
    },
  },
}

export default resolveProductionUrl