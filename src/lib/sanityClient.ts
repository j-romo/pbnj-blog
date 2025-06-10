import { createClient } from '@sanity/client';

const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '69ah3koy',
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
});

export default sanityClient;
export { sanityClient };