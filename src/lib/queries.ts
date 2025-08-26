// GROQ queries for fetching content

// Get all posts for listing
export const allPostsQuery = `
*[_type == "post"] | order(pubDate desc) {
  _id,
  title,
  slug,
  pubDate,
  heroImage {
    asset->{
      _id,
      url
    }
  },
  "excerpt": array::join(string::split(pt::text(body), "")[0..255], "") + "..."
}
`

// Get single post by slug
export const postBySlugQuery = `
*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  pubDate,
  heroImage {
    asset->{
      _id,
      url
    }
  },
  body[] {
    ...,
    _type == "image" => {
      "asset": asset->{
        _id,
        url
      },
      alt,
      caption,
      alignment
    }
  },
  "author": author->name
}
`