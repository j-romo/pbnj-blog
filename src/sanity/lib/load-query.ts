// ./src/sanity/lib/load-query.ts
import { type QueryParams } from "sanity";
import { sanityClient } from '../../lib/sanityClient';

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";

// Use the perspective from env, default to 'published'
const perspective = import.meta.env.PUBLIC_SANITY_PERSPECTIVE || "published";

// Use the preview token for drafts, fallback to read token
const token = import.meta.env.SANITY_DEV_PREVIEW_TOKEN || import.meta.env.SANITY_API_READ_TOKEN;

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {

    if (perspective === "previewDrafts" && !token) {
        throw new Error(
          "The `SANITY_DEV_PREVIEW_TOKEN` or `SANITY_API_READ_TOKEN` environment variable is required for preview mode.",
        );
      }
    
    const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(
    query,
    params ?? {},
    {
        filterResponse: false,
        perspective: perspective as "published" | "previewDrafts",
        resultSourceMap: visualEditingEnabled ? "withKeyArraySelector" : false,
        stega: visualEditingEnabled,
        ...(token ? { token } : {}),
        useCdn: perspective === "published",
      },
  );

  return {
    data: result,
    sourceMap: resultSourceMap,
    perspective,

  };
}