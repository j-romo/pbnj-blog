// ./src/sanity/lib/url-for-image.ts
import { sanityClient } from '../../lib/sanityClient';
import imageUrlBuilder from "@sanity/image-url";
import type { SanityAsset } from '@sanity/image-url/lib/types/types';

export const imageBuilder = imageUrlBuilder(sanityClient);

export function urlForImage(source: SanityAsset) {
  return imageBuilder.image(source);
}