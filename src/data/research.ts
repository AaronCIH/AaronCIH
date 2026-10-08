import { projectImages, type SiteImage } from './media';
import { teasers, type Teaser } from './teasers';

export type Topic = 'Image Generation and Editing' | 'Multimodal Learning' | 'Domain Generalization' | 'Visual Understanding';
export interface Publication {
  id: string;
  name: string;
  title: string;
  year: number;
  venue: string;
  topics: [Topic, ...Topic[]];
  role: string;
  image: SiteImage;
  teaser?: Teaser;
  highlight?: string;
  paper: string;
  project?: string;
  code?: string;
  demo?: string;
  video?: string;
  feature?: {
    headline: string;
    summary: string;
    approach: string;
    impact: string;
  };
}

export const publications: Publication[] = [
  {
    id: 'restore-assess-repeat', name: 'Restore. Assess. Repeat.',
    image: projectImages.rar,
    teaser: teasers.rar,
    title: 'Restore, Assess, Repeat: A Unified Framework for Iterative Image Restoration',
    year: 2026, venue: 'CVPR', topics: ['Image Generation and Editing', 'Multimodal Learning'], role: 'First author',
    paper: 'https://arxiv.org/abs/2603.26385', project: 'https://restore-assess-repeat.github.io',
    video: 'vdqgE22xU2Y',
    feature: {
      headline: 'Restoration that knows when to look again.',
      summary: 'Real images rarely arrive with just one kind of degradation. RAR brings image restoration and quality assessment into a shared, iterative process.',
      approach: 'Identify degradation, restore the image, and verify its quality within a unified latent-space framework.',
      impact: 'A more adaptive way to handle unknown and composite image degradations.',
    },
  },
  {
    id: 'robustvisrag', name: 'RobustVisRAG',
    image: projectImages.rag,
    teaser: teasers.rag,
    title: 'RobustVisRAG: Causality-Aware Vision-Based Retrieval-Augmented Generation under Visual Degradations',
    year: 2026, venue: 'CVPR', topics: ['Multimodal Learning', 'Visual Understanding'], role: 'First author',
    paper: 'https://arxiv.org/abs/2602.22013', project: 'https://robustvisrag.github.io',
    video: '3RFDiwW5F0A',
    feature: {
      headline: 'Reliable answers start with resilient perception.',
      summary: 'Blur, noise, and shadows can disrupt how a model retrieves and reads visual documents. RobustVisRAG separates meaningful content from visual degradation.',
      approach: 'Use a causality-guided dual-path framework to disentangle semantic information and distortion signals.',
      impact: 'More dependable retrieval and grounded generation from imperfect visual evidence.',
    },
  },
  {
    id: 'unirestore', name: 'UniRestore',
    image: projectImages.unirestore,
    teaser: teasers.unirestore,
    title: 'UniRestore: Unified Perceptual and Task-Oriented Image Restoration Model Using Diffusion Prior',
    year: 2025, venue: 'CVPR', topics: ['Image Generation and Editing', 'Multimodal Learning', 'Visual Understanding'], role: 'First author', highlight: 'Highlight',
    paper: 'https://arxiv.org/abs/2501.13134', project: 'https://unirestore.github.io',
    video: 'Jm1NkDDXN90',
    feature: {
      headline: 'Better to our eyes. Better for the task.',
      summary: 'A visually pleasing image is not always the most useful one for a vision model. UniRestore connects perceptual quality with downstream task needs.',
      approach: 'Adapt a diffusion prior with complementary feature restoration and task-aware feature fusion.',
      impact: 'One restoration framework designed for both human perception and machine understanding.',
    },
  },
  {
    id: 'pdaf', name: 'PDAF',
    image: projectImages.pdaf,
    teaser: teasers.pdaf,
    title: 'Exploring Probabilistic Modeling Beyond Domain Generalization for Semantic Segmentation',
    year: 2025, venue: 'ICCV', topics: ['Domain Generalization', 'Visual Understanding'], role: 'First author',
    paper: 'https://arxiv.org/abs/2507.21367', project: 'https://pdaf-iccv.github.io',
    video: 'HQlP0R-xvfI',
    feature: {
      headline: 'Understanding scenes beyond familiar conditions.',
      summary: 'A segmentation model should keep making sense of the world when the environment changes. PDAF models the hidden shifts between visual domains.',
      approach: 'Use a latent domain prior and probabilistic diffusion alignment to refine feature representations.',
      impact: 'A path toward more generalizable semantic segmentation in unfamiliar urban scenes.',
    },
  },
  {
    id: 'apgcc', name: 'APGCC',
    image: projectImages.apgcc,
    teaser: teasers.apgcc,
    title: 'Improving Point-based Crowd Counting and Localization Based on Auxiliary Point Guidance',
    year: 2024, venue: 'ECCV', topics: ['Visual Understanding'], role: 'First author',
    paper: 'https://arxiv.org/abs/2405.10589', project: 'https://apgcc.github.io/',
    video: 'b_ltwfD9dLI',
    feature: {
      headline: 'Every point deserves a better match.',
      summary: 'Counting a crowd is also a matching problem. APGCC gives point-based models clearer guidance on where to look and which proposals to trust.',
      approach: 'Combine Auxiliary Point Guidance with Implicit Feature Interpolation to stabilize proposal-target matching.',
      impact: 'More stable learning for crowd counting and localization across varied scenes.',
    },
  },
  {
    id: 'semantic-dehazing', name: 'Semantic Guidance',
    image: projectImages.dehazing,
    title: 'Semantic Guidance Learning for High-Resolution Non-Homogeneous Dehazing',
    year: 2023, venue: 'CVPRW', topics: ['Image Generation and Editing', 'Visual Understanding'], role: 'Co-author',
    paper: 'https://openaccess.thecvf.com/content/CVPR2023W/NTIRE/html/Yang_Semantic_Guidance_Learning_for_High-Resolution_Non-Homogeneous_Dehazing_CVPRW_2023_paper.html',
  },
  {
    id: 'tsrformer', name: 'TSRFormer',
    image: projectImages.tsrformer,
    title: 'TSRFormer: Transformer Based Two-Stage Refinement for Single Image Shadow Removal',
    year: 2023, venue: 'CVPRW', topics: ['Image Generation and Editing'], role: 'Co-author',
    paper: 'https://openaccess.thecvf.com/content/CVPR2023W/NTIRE/html/Chang_TSRFormer_Transformer_Based_Two-Stage_Refinement_for_Single_Image_Shadow_Removal_CVPRW_2023_paper.html',
  },
  {
    id: 'rvsl', name: 'RVSL',
    image: projectImages.rvsl,
    title: 'RVSL: Robust Vehicle Similarity Learning in Real Hazy Scenes Based on Semi-supervised Learning',
    year: 2022, venue: 'ECCV', topics: ['Visual Understanding', 'Domain Generalization'], role: 'First author',
    paper: 'https://arxiv.org/abs/2209.08630',
    code: 'https://github.com/Cihsaing/rvsl-robust-vehicle-similarity-learning--ECCV22',
  },
  {
    id: 'sjdl', name: 'SJDL-Vehicle',
    image: projectImages.sjdl,
    title: 'SJDL-Vehicle: Semi-supervised Joint Defogging Learning for Foggy Vehicle Re-identification',
    year: 2022, venue: 'AAAI', topics: ['Visual Understanding', 'Domain Generalization'], role: 'First author',
    paper: 'https://ojs.aaai.org/index.php/AAAI/article/view/19911/19670',
    code: 'https://github.com/Cihsaing/SJDL-Foggy-Vehicle-Re-Identification--AAAI2022',
  },
  {
    id: 'missing-recovery', name: 'Missing Recovery',
    image: projectImages.reflection,
    title: 'Missing Recovery: Single Image Reflection Removal Based on Auxiliary Prior Learning',
    year: 2022, venue: 'IEEE TIP', topics: ['Image Generation and Editing'], role: 'Co-author',
    paper: 'https://ieeexplore.ieee.org/document/10002393',
  },
  {
    id: 'all-snow-removed', name: 'ALL Snow Removed',
    image: projectImages.snow,
    title: 'ALL Snow Removed: Single Image Desnowing Algorithm Using Hierarchical Dual-tree Complex Wavelet Representation and Contradict Channel Loss',
    year: 2021, venue: 'ICCV', topics: ['Image Generation and Editing'], role: 'Co-author',
    paper: 'https://openaccess.thecvf.com/content/ICCV2021/html/Chen_ALL_Snow_Removed_Single_Image_Desnowing_Algorithm_Using_Hierarchical_Dual-Tree_ICCV_2021_paper.html',
    code: 'https://github.com/weitingchen83/ICCV2021-Single-Image-Desnowing-HDCWNet',
  },
  {
    id: 'desmokenet', name: 'DesmokeNet',
    image: projectImages.desmokenet,
    title: 'DesmokeNet: A Two-stage Smoke Removal Pipeline Based on Self-Attentive Feature Consensus and Multi-Level Contrastive Regularization',
    year: 2021, venue: 'IEEE TCSVT', topics: ['Image Generation and Editing'], role: 'Co-author',
    paper: 'https://ieeexplore.ieee.org/document/9517089', code: 'https://github.com/weitingchen83/TCSVT-DesmokeNet',
  },
  {
    id: 'contourletnet', name: 'ContourletNet',
    image: projectImages.contourletnet,
    title: 'ContourletNet: A Generalized Rain Removal Architecture Using Multi-Direction Representation and Hierarchical Decomposition',
    year: 2021, venue: 'BMVC', topics: ['Image Generation and Editing'], role: 'Co-author',
    paper: 'https://www.bmvc2021-virtualconference.com/assets/papers/0491.pdf',
    code: 'https://github.com/cctakaet/ContourletNet-BMVC2021',
  },
];

export const featured = publications.filter(
  (publication): publication is Publication & { feature: NonNullable<Publication['feature']> } => Boolean(publication.feature),
);
const homeOrder = ['restore-assess-repeat', 'robustvisrag', 'unirestore', 'pdaf', 'apgcc'];
export const homeResearch = homeOrder.map((id) => {
  const publication = featured.find((item) => item.id === id);
  if (!publication) throw new Error(`Home research project is missing: ${id}`);
  return publication;
});
export const videoUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
