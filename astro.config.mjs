// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://j-romo.github.io',
	//site: 'https://www.peanutbutterandjelly.ai',
	base: '/pbnj-blog',
	integrations: [mdx(), sitemap()],
});
