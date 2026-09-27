import type { ImageMetadata } from 'astro';
import sources from './image-sources.json';
import portrait from '../assets/legacy/aaron-portrait.png';
import rar from '../assets/legacy/restore-assess-repeat.png';
import rag from '../assets/legacy/robustvisrag.png';
import unirestore from '../assets/legacy/unirestore.png';
import pdaf from '../assets/legacy/pdaf.png';
import apgcc from '../assets/legacy/apgcc.png';
import dehazing from '../assets/legacy/semantic-dehazing.png';
import tsrformer from '../assets/legacy/tsrformer.png';
import rvsl from '../assets/legacy/rvsl.png';
import sjdl from '../assets/legacy/sjdl.png';
import snow from '../assets/legacy/all-snow-removed.png';
import desmokenet from '../assets/legacy/desmokenet.png';
import contourletnet from '../assets/legacy/contourletnet.png';
import reflection from '../assets/legacy/missing-recovery.png';
import samsung from '../assets/legacy/samsung.png';
import mediatek from '../assets/legacy/mediatek.png';
import asml from '../assets/legacy/asml.png';
import capacura from '../assets/legacy/capacura.png';
import itri from '../assets/legacy/itri.png';

export interface SiteImage {
  src: ImageMetadata;
  alt: string;
  sourcePage: string;
}

function originalImage(id: string, src: ImageMetadata, alt: string): SiteImage {
  const source = sources.images.find((image) => image.id === id);
  if (!source) throw new Error(`Image provenance missing: ${id}`);
  return { src, alt, sourcePage: source.fullSizePage ?? `https://sites.google.com/view/cihsiang/${source.page}` };
}

export const portraitImage = originalImage('aaron-portrait', portrait, 'Portrait of I-Hsiang (Aaron) Chen');
export const projectImages = {
  rar: originalImage('restore-assess-repeat', rar, 'Sequential image restoration examples from Restore, Assess, Repeat'),
  rag: originalImage('robustvisrag', rag, 'RobustVisRAG overview showing visual document retrieval and grounded answer generation'),
  unirestore: originalImage('unirestore', unirestore, 'UniRestore comparison of perceptual and task-oriented restoration of a street scene'),
  pdaf: originalImage('pdaf', pdaf, 'PDAF framework for latent domain modeling and domain compensation in semantic segmentation'),
  apgcc: originalImage('apgcc', apgcc, 'APGCC architecture showing auxiliary point guidance for crowd counting and localization'),
  dehazing: originalImage('semantic-dehazing', dehazing, 'Research figure for semantic guidance in non-homogeneous image dehazing'),
  tsrformer: originalImage('tsrformer', tsrformer, 'TSRFormer two-stage refinement for single-image shadow removal'),
  rvsl: originalImage('rvsl', rvsl, 'RVSL research figure for vehicle similarity learning in hazy scenes'),
  sjdl: originalImage('sjdl', sjdl, 'SJDL-Vehicle joint defogging and vehicle re-identification framework'),
  snow: originalImage('all-snow-removed', snow, 'Single-image desnowing examples from ALL Snow Removed'),
  desmokenet: originalImage('desmokenet', desmokenet, 'DesmokeNet image smoke removal research figure'),
  contourletnet: originalImage('contourletnet', contourletnet, 'ContourletNet research figure for single-image rain removal'),
  reflection: originalImage('missing-recovery', reflection, 'Missing Recovery single-image reflection removal research figure'),
};

export const companyImages = {
  samsung: originalImage('samsung', samsung, 'Samsung logo'),
  mediatek: originalImage('mediatek', mediatek, 'MediaTek logo'),
  asml: originalImage('asml', asml, 'ASML logo'),
  capacura: originalImage('capacura', capacura, 'Capacura logo'),
  itri: originalImage('itri', itri, 'Industrial Technology Research Institute logo'),
};
