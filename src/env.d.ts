// ./src/env.d.ts
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
    readonly PUBLIC_SANITY_PROJECT_ID: string;
    readonly PUBLIC_SANITY_DATASET: string;
    readonly PUBLIC_SANITY_API_VERSION: string;
    readonly PUBLIC_SANITY_VISUAL_EDITING_ENABLED: string;
}