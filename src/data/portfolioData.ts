import { Certificate, Project, HackathonAchievement, EducationItem } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'ABHILASH K P',
  title: 'B.E. Computer Science and Engineering | Aspiring Software Developer',
  headlineLead: 'I BUILD',
  headlineAccent1: 'THINGS',
  headlineMiddle: 'THAT',
  headlineAccent2: 'THINK.',
  tagline: 'CODE • INNOVATE • INSPIRE',
  university: 'University College of Engineering, Nagercoil (UCEN)',
  cgpa: '8.1',
  semester: 'Semester 3',
  languages: [
    { name: 'Tamil', level: 'Fluent' },
    { name: 'English', level: 'Basic' },
    { name: 'Malayalam', level: 'Intermediate' },
  ],
  bio: `I am ABHILASH K P, a B.E. Computer Science and Engineering student at University College of Engineering, Nagercoil, with a beginner-level foundation in C, C++ and Java. I am interested in software development, problem-solving, Generative AI, Machine Learning, AI tools and building useful student-focused applications. I keep strengthening my skills through coursework, lab practice, certifications, hackathons, paper presentations, student technical events and project-based learning. My goal is to build a strong base in programming, data structures and application development, and to grow through internships, team projects and hands-on practice, becoming a skilled software developer who contributes to innovative technology solutions.`,
  coreCompetencies: [
    'Programming fundamentals and logical problem-solving',
    'Object-oriented programming and introductory data structures',
    'Git and GitHub basics',
    'VS Code development environment',
    'Team collaboration, communication and quick learning',
  ],
  careerInterests: [
    'Software Development and Application Building',
    'Generative AI and Machine Learning',
    'AI tools and practical AI applications',
    'Data Structures, Algorithms and Problem-solving',
    'Blockchain Technology',
    'Student-focused products that make campus life more organised and productive',
  ],
  skillsList: 'C | C++ | Java | Python / DSA | Flutter / Git | GitHub / AI | More…',
  contact: {
    email: 'akp911187@gmail.com',
    phone: '8015043129',
    phoneFormatted: '+91 80150 43129',
    location: 'Kanyakumari, Tamil Nadu, India',
    linkedin: 'https://www.linkedin.com/in/abhilashkp2006-/',
    github: 'https://github.com/AbhilashKP-2006',
  },
};

export const SKILL_GROUPS = [
  {
    category: 'Programming',
    skills: ['C', 'C++', 'Java', 'Python'],
  },
  {
    category: 'Core Concepts',
    skills: ['Object-Oriented Programming', 'Data Structures and Algorithms (learning)'],
  },
  {
    category: 'Development',
    skills: ['Flutter', 'Dart (learning)', 'HTML', 'CSS', 'JavaScript (explored for the Studora concept)'],
  },
  {
    category: 'Tools',
    skills: ['Visual Studio Code', 'Git', 'GitHub'],
  },
  {
    category: 'Artificial Intelligence',
    skills: ['Generative AI', 'Prompt Engineering', 'Machine Learning Fundamentals', 'AI Tools'],
  },
];

export const SOFT_SKILLS = [
  { name: 'Communication', detail: 'presenting ideas in paper presentations, PPT rounds and team hackathons' },
  { name: 'Problem-solving', detail: 'approaching lab programs and project ideas step by step' },
  { name: 'Teamwork', detail: 'collaborating in 24-hour and 48-hour hackathon teams' },
  { name: 'Time Management', detail: 'balancing coursework, certifications and student events' },
  { name: 'Quick Learning & Adaptability', detail: 'picking up new tools, languages and AI platforms' },
  { name: 'Research & Analytical Thinking', detail: 'investigating technologies, systems and user problem statements' },
];

export const CURRENTLY_LEARNING = [
  'Flutter and Dart for mobile app development (applied toward the Studora concept)',
  'Generative AI concepts and prompt engineering through online courses and certifications',
  'Object-oriented programming through C++ and Java lab practice',
  'Data Structures and Algorithms (continuing)',
];

export const PROJECTS: Project[] = [
  {
    id: 'studora',
    title: 'Studora: Student Assistant App Concept',
    subtitle: 'Earlier name CampusMate',
    tag: 'CONCEPT',
    stage: 'Concept / development planning',
    description: 'Helps students organise college announcements, assignments, exam dates, fee reminders, internships, hackathons and symposium updates in one place.',
    points: [
      'Planned flow: login, group-access permission, AI-based summaries, key deadline extraction and user-confirmed reminders.',
      'Turns long, cluttered announcement messages into concise, actionable items.',
      'Tools explored: HTML, CSS, JavaScript, Flutter and Dart (learning). Not implemented or deployed.',
    ],
  },
  {
    id: 'pathfinder',
    title: 'PathFinder: Smart Integrated Transport System',
    subtitle: 'Integrated multimodal travel concept',
    tag: 'CONCEPT',
    stage: 'Concept / idea stage',
    description: 'India sees about 3.03 billion tourist travels and 20-25% explore new destinations; many tourists struggle with confusing public transport, lack of real-time tracking, hard-to-find routes and language barriers.',
    points: [
      'One unified platform concept bringing together train tracking, domestic bus routes and live bus locations.',
      'Concept and idea stage; not completed or deployed.',
    ],
  },
  {
    id: 'finguard',
    title: 'FinGuard: Cross-Border Financial Transaction System',
    subtitle: 'Smart Horizon 2026 Hackathon (Problem Statement SH-FIN-04)',
    tag: 'HACKATHON',
    stage: '48-Hour Hackathon Concept & Research',
    role: 'Team Member',
    contribution: 'Research and concept development',
    description: 'Blockchain-enabled financial services architecture conceptualized in a 48-hour team hackathon environment.',
    points: [
      'Explored gig-worker and freelancer financial services, digital wallets, multi-currency (USD-INR) support, and cross-border remittances.',
      'Researched KYC exploration, blockchain and smart contracts (Ethereum and Polygon research).',
      'Conceptualized Dijkstra-based currency routing and AI-assisted fraud risk prediction.',
    ],
  },
];

export const PRACTICAL_EXPERIENCE = {
  title: 'College Lab Programming',
  institution: 'University College of Engineering, Nagercoil',
  description: 'Practiced C, C++ and Java programs in laboratory work; worked on programming fundamentals, debugging and understanding outputs; building the habit of writing, running and testing code regularly with VS Code and Git/GitHub.',
  note: 'Open to internships and team projects.',
};

export const EDUCATION: EducationItem[] = [
  {
    degree: 'B.E. Computer Science and Engineering',
    institution: 'University College of Engineering, Nagercoil (UCEN)',
    period: '2025 – 2029',
    details: 'Current Semester 3',
    score: 'CGPA: 8.1',
    isMain: true,
  },
  {
    degree: 'Higher Secondary Certificate (HSC)',
    institution: 'St. Ephraem M.S.C. Higher Secondary School, Sooriacode',
    score: '528 / 600 (88%)',
  },
  {
    degree: 'Secondary School Leaving Certificate (SSLC)',
    institution: 'St. Ephraem M.S.C. Higher Secondary School, Sooriacode',
    score: '438 / 500 (87.6%)',
  },
];

export const CERTIFICATES: Certificate[] = [
  // AI and Generative AI (8)
  { id: 'c1', issuer: 'Microsoft', name: 'Foundations of AI and Machine Learning', category: 'ai' },
  { id: 'c2', issuer: 'IBM', name: 'Generative AI Language Modeling with Transformers', category: 'ai' },
  { id: 'c3', issuer: 'Google', name: 'Gemini Certified Student', category: 'ai' },
  { id: 'c4', issuer: 'Anthropic', name: 'Claude 101', category: 'ai' },
  { id: 'c5', issuer: 'Anthropic', name: 'Deploying Claude Enterprise with Confidence: The Five Decisions That Shape Your Rollout', category: 'ai' },
  { id: 'c6', issuer: 'IBM SkillsBuild', name: 'AI Ethics', category: 'ai' },
  { id: 'c7', issuer: 'Neo4j', name: 'Neo4j & Generative AI Certification Pathway', category: 'ai' },
  { id: 'c8', issuer: 'OpenAI', name: 'Applied AI at Work / Pathway Completion Certificate', category: 'ai' },
  
  // Cybersecurity and Cloud (3)
  { id: 'c9', issuer: 'Google', name: 'Foundations of Cybersecurity', category: 'security' },
  { id: 'c10', issuer: 'IBM SkillsBuild', name: 'Cybersecurity and Data', category: 'security' },
  { id: 'c11', issuer: 'Microsoft', name: 'Build a Computer Vision App with Azure Cognitive Services', category: 'security' },
  
  // Programming and Computer Science (2)
  { id: 'c12', issuer: 'NPTEL', name: 'Data Structures and Algorithms Design', category: 'programming' },
  { id: 'c13', issuer: 'Cisco Networking Academy', name: 'Python Essentials 1', category: 'programming' },
  
  // Other (2)
  { id: 'c14', issuer: 'Vanderbilt University', name: 'Prompt Engineering for ChatGPT', category: 'other' },
  { id: 'c15', issuer: 'Coursera', name: 'Creating a Free Business Page with Blogger', category: 'other' },
];

export const ACHIEVEMENTS: HackathonAchievement[] = [
  {
    id: 'byteathon-2026',
    title: 'BYTEATHON 2026 — 24-Hour National-Level Hackathon',
    badge: 'TOP 30 FINALIST',
    highlight: true,
    organizer: 'Department of Computer Science and Engineering, Noorul Islam Centre for Higher Education (NICHE), Kumaracoil, Thuckalay, Kanniyakumari, Tamil Nadu',
    date: '15–16 October 2026',
    team: 'UCEN Innovators',
    description: 'Shortlisted among the Top 30 teams out of numerous national entries and participated in the intensive 24-hour offline final hackathon round.',
  },
  {
    id: 'smart-horizon-2026',
    title: 'Smart Horizon 2026 · 48-Hour International Hackathon',
    organizer: 'New Horizon College of Engineering, Bengaluru · Departments of AI & ML and CSE',
    date: '3–5 September 2026',
    team: 'UCEN Innovators · Problem Statement SH-FIN-04',
    project: 'FinGuard: Blockchain-Enabled Cross-Border Financial Transaction System',
    description: '48 hours. Endless ideas. One unforgettable experience. 🚀 Stepped out of my comfort zone, worked with my team and turned ideas into action, from brainstorming and problem-solving to working under pressure. Explored smart contracts, multi-currency wallet, decentralized ID verification, fraud detection and Dijkstra-based lowest-cost currency routing. Contribution: research and concept development.',
    hashtags: ['#SmartHorizon2026', '#Hackathon', '#Teamwork', '#ProblemSolving', '#Innovation', '#Learning', '#CSE'],
  },
  {
    id: 'build-with-bharat',
    title: 'Build With Bharat 2.0',
    organizer: 'NIT Delhi',
    team: 'UCEN Innovators',
    description: 'Participated with team UCEN Innovators in the competitive PPT Submission Round.',
  },
  {
    id: 'ponjesly-bluff-royale',
    title: 'Bluff Royale',
    organizer: 'Ponjesly College of Engineering',
    badge: '3RD PRIZE',
    description: 'Secured 3rd Prize in the competitive technical event.',
  },
  {
    id: 'paper-presentations',
    title: 'Technical Paper Presentations',
    description: 'Presented technical research and conceptual papers at prestigious institutions: Thiagarajar College of Engineering, SRM Madurai, DMI College of Engineering, and St. Xavier Catholic College of Engineering.',
  },
  {
    id: 'velammal-funtrix',
    title: 'Velammal FUNTRIX',
    description: 'Participant in technical challenges and student events.',
  },
  {
    id: 'geeks2code',
    title: 'Geeks2Code',
    description: 'Participation in coding and technical problem-solving event.',
  },
];
