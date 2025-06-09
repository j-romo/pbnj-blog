// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import { loadEnv } from "vite";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
    process.env.NODE_ENV || 'development',
    process.cwd(),
    "",
);

// https://astro.build/config
export default defineConfig({
    site: 'https://peanutbutterandjelly.ai',
    integrations: [
        mdx(), 
        sitemap(), 
        // Only include Sanity studio in development
        ...(process.env.NODE_ENV === 'development' ? [
            sanity({
              projectId: PUBLIC_SANITY_PROJECT_ID || '69ah3koy',
              dataset: PUBLIC_SANITY_DATASET || 'production',
              useCdn: true, 
              apiVersion: "2023-05-03", 
              studioBasePath: '/studio',
            })
        ] : []),
        react(),
    ],
    output: 'static',
});