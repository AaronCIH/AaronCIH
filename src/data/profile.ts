import { companyImages } from './media';

export const profile = {
  name: 'I-Hsiang (Aaron) Chen',
  email: 'f09921058@g.ntu.edu.tw',
  github: 'https://github.com/AaronCIH',
  linkedin: 'https://www.linkedin.com/in/cihsiang',
  originalSite: 'https://sites.google.com/view/cihsiang/home',
  bio: 'I explore how machines perceive, restore, and understand the visual world. My research connects generative models, robust visual learning, and multimodal understanding, with a focus on systems that work beyond clean, familiar conditions.',
  background: 'My research background spans National Taiwan University and the University of Washington, alongside industry research experience at Samsung Research, MediaTek, and ASML.',
};

export const experience = [
  { id: 'samsung', company: 'Samsung Research UK', image: companyImages.samsung, role: 'Research Intern', period: 'Jun - Dec 2025', location: 'Cambridge, United Kingdom', topic: 'Multimodal learning', description: 'Researched unified multimodal understanding and generation models, exploring the connection between perceiving and creating visual content.' },
  { id: 'mediatek', company: 'MediaTek', image: companyImages.mediatek, role: 'Research Intern · MM', period: 'Jul - Dec 2023', location: 'Hsinchu, Taiwan', topic: 'Neural video compression', description: 'Researched AI-driven video compression, with a focus on end-to-end learning-based video codecs.' },
  { id: 'asml', company: 'ASML', image: companyImages.asml, role: 'Research Intern · D&E', period: 'Jan - Apr 2022', location: 'Hsinchu, Taiwan', topic: 'Synthetic data generation', description: 'Developed synthetic failure-case generation methods to augment training data for lithography defect detection.' },
  { id: 'capacura', company: 'Capacura', image: companyImages.capacura, role: 'Intern', period: 'Jul - Sep 2019', location: 'Cologne, Germany', topic: 'Applied machine learning', description: 'Built machine learning models to explore IPO-stage investment opportunities using company characteristics and market trends.' },
  { id: 'itri', company: 'Industrial Technology Research Institute', image: companyImages.itri, role: 'Project experience', period: 'Dec 2018 - Sep 2019', location: 'Taipei, Taiwan', topic: 'Autonomous driving', description: 'Contributed to data collection, preprocessing, and 3D scene annotation for self-driving research. Formal role title is being reviewed for this preview.' },
];

export const education = [
  { school: 'University of Washington', study: 'Visiting Scholar · Electrical & Computer Engineering', period: '2024 - 2025', detail: 'Research with Prof. Jenq-Neng Hwang on diffusion models and image enhancement.' },
  { school: 'National Taiwan University', study: 'Graduate research · Electrical Engineering & Computer Science', period: 'Graduate study from 2020', detail: 'Research with Prof. Sy-Yen Kuo on image enhancement, re-identification, and crowd counting. Degree timeline and current status to be confirmed.' },
  { school: 'National Taiwan University of Science and Technology', study: 'B.S. · Electronic & Computer Engineering', period: '2016 - 2020', detail: 'Minor in Finance. Academic work spanning IC design and microcontrollers.' },
];

export const honors = [
  { year: '2025', title: 'NTU Outstanding Young Award', organization: 'National Taiwan University', description: 'Recognition representing the College of Electrical Engineering and Computer Science.' },
  { year: '2023', title: 'CTCI Research Award', organization: 'CTCI Foundation', description: 'Recognition of research in artificial intelligence.' },
  { year: '2022', title: 'Hon-Hai Tech Award', organization: 'Hon Hai', description: 'Artificial intelligence scholarship.' },
  { year: '2021', title: 'Advanced Technology Award', organization: 'Doctoral research scholarship', description: 'Support for research capacity and international academic development.' },
  { year: '2020', title: 'ASML Elite Scholarship', organization: 'ASML', description: 'Recognition of academic performance.' },
  { year: '2020', title: 'Hon-Hai Scholarship', organization: 'Hon Hai', description: 'Recognition of academic performance.' },
  { year: '2019', title: 'Academic Award', organization: 'National Taiwan University of Science and Technology', description: 'Recognition of academic achievement.' },
];

export const competitions = [
  { year: '2020', title: 'University Project Contest', organization: 'National Taiwan University of Science and Technology', result: 'Excellent Award', description: 'Deep learning for voice synthesis.' },
  { year: '2019', title: 'AIoT InnoWorks', organization: 'Advantech', result: '3rd Place', description: 'A campus restaurant management system combining object detection and microcontrollers.' },
  { year: '2019', title: 'Python Programming Competition', organization: 'TQC+', result: 'Merit Award', description: 'Intercollegiate programming competition.' },
  { year: '2016', title: 'Senior High School Project Contest', organization: 'Student project competition', result: 'Honorable Mention', description: 'A bicycle training system combining machine learning and microcontrollers.' },
  { year: '2015', title: 'WorldSkills Competition (Taiwan)', organization: 'National skills competition', result: '1st Place', description: 'Circuit design, microcontroller programming, and function design.' },
];

export const news = [
  { date: 'Apr 2026', tag: 'Publication', text: 'Restore, Assess, Repeat has been accepted to CVPR 2026.', href: 'publications/#restore-assess-repeat' },
  { date: 'Apr 2026', tag: 'Publication', text: 'RobustVisRAG has been accepted to CVPR 2026.', href: 'publications/#robustvisrag' },
  { date: 'Nov 2025', tag: 'Recognition', text: 'Recognized with the NTU Outstanding Young Award.', href: 'awards/' },
  { date: 'Jul 2025', tag: 'Publication', text: 'Exploring probabilistic modeling for semantic segmentation at ICCV 2025.', href: 'publications/#pdaf' },
  { date: 'Jun 2025', tag: 'Experience', text: 'Joined Samsung Research UK for a research internship.', href: 'experience/' },
  { date: 'Apr 2025', tag: 'Publication', text: 'UniRestore selected as a CVPR 2025 Highlight.', href: 'publications/#unirestore' },
  { date: 'Jul 2024', tag: 'Publication', text: 'Auxiliary Point Guidance for crowd counting at ECCV 2024.', href: 'publications/#apgcc' },
  { date: 'May 2024', tag: 'Experience', text: 'Began visiting research at the University of Washington.', href: 'experience/#education' },
  { date: 'Dec 2023', tag: 'Recognition', text: 'Received the CTCI Research Award.', href: 'awards/' },
];
