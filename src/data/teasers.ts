import type { ImageMetadata } from 'astro';
import type { SiteImage } from './media';
import sources from './teaser-sources.json';
import rarPoster from '../assets/teasers/rar.webp';
import rarVideo from '../assets/teasers/rar.mp4';
import unirestorePoster from '../assets/teasers/unirestore.webp';
import unirestoreVideo from '../assets/teasers/unirestore.mp4';
import pdafPoster from '../assets/teasers/pdaf.webp';
import pdafVideo from '../assets/teasers/pdaf.mp4';
import apgccPoster from '../assets/teasers/apgcc.webp';
import apgccVideo from '../assets/teasers/apgcc.mp4';
import ragPoster from '../assets/teasers/robustvisrag.webp';
import ragGeneration from '../assets/teasers/robustvisrag-generation.webp';

interface TeaserFigure {
  label: string;
  image: SiteImage;
}

export interface Teaser {
  poster: SiteImage;
  caption: string;
  video?: string;
  figures?: [TeaserFigure, ...TeaserFigure[]];
}

function teaser(id: string, src: ImageMetadata, caption: string, video?: string): Teaser {
  const source = sources.sources.find((item) => item.id === id);
  if (!source) throw new Error(`Teaser source is missing: ${id}`);
  return { poster: { src, alt: caption, sourcePage: source.page }, caption, video };
}

const retrieval = teaser('robustvisrag', ragPoster, 'Retrieving the relevant visual document despite degraded image quality.');
const generation = teaser('robustvisrag-generation', ragGeneration, 'Comparing generated answers to a question about a degraded retrieved document.');

export const teasers = {
  rar: teaser('rar', rarPoster, 'Iterative quality assessment and restoration: recovering detail from a degraded image.', rarVideo),
  unirestore: teaser('unirestore', unirestorePoster, 'Image restoration for human perception and downstream vision tasks.', unirestoreVideo),
  pdaf: teaser('pdaf', pdafPoster, 'A visual comparison of baseline and PDAF semantic segmentation predictions.', pdafVideo),
  apgcc: teaser('apgcc', apgccPoster, 'Crowd counting and localization with point detections in a real scene.', apgccVideo),
  rag: {
    ...retrieval,
    caption: 'Retrieval and answer generation from degraded visual documents.',
    figures: [
      { label: 'Retrieve', image: retrieval.poster },
      { label: 'Generation', image: generation.poster },
    ],
  },
} satisfies Record<string, Teaser>;
