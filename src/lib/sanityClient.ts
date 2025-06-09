import { createClient } from '@sanity/client';

const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    useCdn: true,
    apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
});

export default sanityClient; // Add default export
export { sanityClient }; // Keep named export for compatibility