import fs from 'fs';
import path from 'path';

// Define DB Path
const DB_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Interface for DB Structure
export interface DbSchema {
  users: any[];
  pages: any[];
  projects: any[];
  experiences: any[];
  skills: any[];
  testimonials: any[];
  blog_posts: any[];
  services: any[];
  chatbot_knowledge: any[];
  analytics_events: any[];
  site_settings: any[];
  contact_messages: any[];
  newsletter_subs: any[];
  home_content: any[];
  work_items: any[];
}

// Initial Data Helper
const getInitialData = (): DbSchema => {
  return {
    users: [
      {
        id: 'admin-1',
        email: 'pial@pialmahmud.com',
        // bcrypt hash for password: "admin123" (demo credential, change in production)
        password_hash: '$2a$10$krRmDr4/j8kzX5vqmPk7cO.vYaPJ8jlEeIShS8DfRkI6kh39LiWYO',
        name: 'Pial Mahmud',
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ],
    pages: [
      {
        id: 'page-home',
        slug: 'home',
        title: 'Home',
        meta_title: 'Pial Mahmud | AI-Powered Digital Marketing & SEO Growth Expert',
        meta_description: 'Engineering Digital Growth Beyond the Algorithm. Discover premium, AI-powered SEO, data-driven marketing, and growth hacking strategies with Pial Mahmud.',
        focus_keyword: 'Digital Marketing & SEO Expert',
        og_image: '/images/og-home.jpg',
        seo_score: 95,
        is_published: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'page-about',
        slug: 'about',
        title: 'About',
        meta_title: 'About Pial Mahmud — AI-Powered Digital Marketing Expert',
        meta_description: 'Learn about Pial Mahmud, a top-tier digital marketing and SEO expert with 5+ years of experience driving exceptional growth for global brands.',
        focus_keyword: 'Digital Marketing Expert',
        og_image: '/images/og-home.jpg',
        seo_score: 88,
        is_published: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'page-services',
        slug: 'services',
        title: 'Services',
        meta_title: 'Digital Marketing Services — SEO, PPC & AI Marketing | Pial Mahmud',
        meta_description: 'Explore premium digital marketing services: technical SEO, AI-powered marketing, full-funnel campaigns, content strategy, and conversion optimization.',
        focus_keyword: 'Digital Marketing Services',
        og_image: '/images/og-home.jpg',
        seo_score: 90,
        is_published: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'page-case-studies',
        slug: 'case-studies',
        title: 'Case Studies',
        meta_title: 'Case Studies — Proven SEO & Digital Marketing Results | Pial Mahmud',
        meta_description: 'Real campaigns. Real results. Explore case studies showing 400%+ traffic growth, 5x ROAS, and measurable ROI across industries.',
        focus_keyword: 'SEO Case Studies',
        og_image: '/images/og-home.jpg',
        seo_score: 87,
        is_published: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'page-contact',
        slug: 'contact',
        title: 'Contact',
        meta_title: 'Contact Pial Mahmud — Start Your Growth Journey Today',
        meta_description: 'Get in touch with Pial Mahmud for digital marketing, SEO, and AI-powered growth strategies. Free consultation, 24-hour response time.',
        focus_keyword: 'Hire SEO Expert',
        og_image: '/images/og-home.jpg',
        seo_score: 89,
        is_published: true,
        created_at: new Date().toISOString()
      }
    ],
    projects: [
      {
        id: 'proj-1',
        slug: 'gloria-tech-seo-growth',
        client: 'Gloria Tech Ltd',
        tag: 'Technology · SEO',
        title: 'Gloria Tech - 340% Traffic Growth',
        description: 'Scaled organic traffic by 3.4x using next-generation semantic topic clustering and intent-driven content architecture.',
        challenge: 'Gloria Tech had stagnant search engine traffic, high dependency on paid channels, and low crawl rates on their technical documentation.',
        solution: 'Implemented structured schemas, optimized web vitals, deployed a programmatic SEO content engine, and conducted a high-authority guest outreach campaign.',
        results: '340% increase in organic monthly traffic, 45% reduction in customer acquisition cost (CAC), and top 3 rankings for 120 high-value transactional keywords.',
        impact_metrics: { traffic_growth: '340%', rank_keywords: '120+', cac_reduction: '45%' },
        image: '/images/project1.jpg',
        technologies: ['SEO & SEM', 'Google Search Console', 'Ahrefs', 'Technical SEO', 'Content Strategy'],
        featured: true,
        case_study: 'gloria-tech-seo-case-study',
        meta_title: 'Gloria Tech — 340% Organic Traffic Growth Case Study | Pial Mahmud',
        meta_description: 'How semantic topic clustering and intent-driven content architecture drove 340% organic traffic growth for Gloria Tech. A real SEO case study by Pial Mahmud.',
        focus_keyword: 'SEO traffic growth case study'
      },
      {
        id: 'proj-2',
        slug: 'outbuild-revenue-doubling',
        client: 'Outbuild BD',
        tag: 'Construction · Growth Hacking',
        title: 'Outbuild - Revenue Doubled in 6 Months',
        description: 'Developed an end-to-end inbound marketing acquisition funnel coupled with intent-targeted search Ads.',
        challenge: 'Low conversion rates on landing pages and stagnant inbound pipeline velocity for B2B target groups.',
        solution: 'A/B tested conversion path designs, integrated interactive calculators, engineered lead magnets, and optimized Meta and Google Ad placements.',
        results: '100% (2x) increase in monthly recurring revenue (MRR), 5.4% lift in click-to-lead landing page conversion rates.',
        impact_metrics: { revenue_growth: '2x MRR', conversion_rate: '+5.4%', roi: '280%' },
        image: '/images/project2.jpg',
        technologies: ['Growth Hacking', 'A/B Testing', 'Conversion Optimization', 'Meta Ads', 'Lead Generation'],
        featured: true,
        case_study: 'outbuild-growth-hacking',
        meta_title: 'Outbuild — Revenue Doubled in 6 Months | Growth Hacking Case Study',
        meta_description: 'A CRO-led growth hacking engagement that doubled MRR for Outbuild BD in 6 months through A/B testing and intent-targeted search ads.',
        focus_keyword: 'growth hacking case study'
      },
      {
        id: 'proj-3',
        slug: 'ecommerce-5x-roas',
        client: 'E-Commerce Brand',
        tag: 'E-Commerce · Paid Ads',
        title: 'E-Commerce Client - 500% ROI on Ad Spend',
        description: 'Optimized multi-channel e-commerce acquisition using hyper-targeted retargeting and AI-driven dynamic copy.',
        challenge: 'Ad fatigue and high shopping cart abandonment rates leading to low overall return on ad spend (ROAS).',
        solution: 'Rebuilt retargeting campaigns with dynamic product ads, designed customer journey triggers, and optimized mobile-first checkout UI.',
        results: '500% overall ROI on advertising spend (5x ROAS), 28% reduction in checkout abandonment.',
        impact_metrics: { roas: '5.0x', cart_abandonment: '-28%', revenue: '+$180K' },
        image: '/images/project3.jpg',
        technologies: ['Social Media Marketing', 'E-commerce Marketing', 'Retargeting', 'Analytics', 'Copywriting'],
        featured: true,
        case_study: 'ecommerce-roas-boost',
        meta_title: 'E-Commerce 5x ROAS — Paid Ads Case Study | Pial Mahmud',
        meta_description: 'How AI-driven dynamic copy and hyper-targeted retargeting delivered 500% ROI on ad spend for an e-commerce brand. A paid media case study by Pial Mahmud.',
        focus_keyword: 'ecommerce ROAS case study'
      }
    ],
    experiences: [
      {
        id: 'exp-1',
        job_title: 'SEO & Growth Lead / SEO Executive',
        company_name: 'Gloria Tech Ltd',
        start_date: '2023-01-01',
        end_date: '',
        is_current: true,
        description: 'Leading organic search initiatives, building SEO strategies, running core web audits, and executing semantic content frameworks.',
        achievements: ['Achieved 340% organic traffic growth', 'Integrated AI workflows to scale content output by 4x', 'Mentored junior analysts in link acquisition campaigns'],
        display_order: 1
      },
      {
        id: 'exp-2',
        job_title: 'Digital Marketing Executive',
        company_name: 'Outbuild BD',
        start_date: '2021-06-01',
        end_date: '2023-01-01',
        is_current: false,
        description: 'Executed conversion rate optimization (CRO) audits, managed Meta and Google Search advertising campaigns, and designed inbound funnels.',
        achievements: ['Doubled MRR inside 6 months for flagship services', 'Managed monthly advertising budgets of $15K+', 'Set up advanced server-side GTM event tracking'],
        display_order: 2
      },
      {
        id: 'exp-3',
        job_title: 'Digital Marketing Executive',
        company_name: 'TutorsPlane',
        start_date: '2020-03-01',
        end_date: '2021-05-01',
        is_current: false,
        description: 'Handled US-based client acquisition remote marketing campaigns, email newsletter workflows, and social media brand positioning.',
        achievements: ['Grew organic newsletter subscribers by 8,000+', 'Designed and automated B2C cold-email sequences'],
        display_order: 3
      },
      {
        id: 'exp-4',
        job_title: 'Digital Marketing Intern',
        company_name: 'Kins Digital Communications',
        start_date: '2019-06-01',
        end_date: '2020-02-01',
        is_current: false,
        description: 'Supported technical SEO auditing, keyword research, meta-data optimization, and competitor analysis.',
        achievements: ['Identified and resolved 400+ crawl errors for client websites', 'Learnt base strategies for off-page link structures'],
        display_order: 4
      }
    ],
    skills: [
      { id: 'sk-1', category: 'Digital Marketing', skill_name: 'SEO & SEM (On-Page, Off-Page, Technical)', proficiency_level: 97, display_order: 1 },
      { id: 'sk-2', category: 'Digital Marketing', skill_name: 'AI Marketing & Prompt Engineering', proficiency_level: 92, display_order: 2 },
      { id: 'sk-3', category: 'Digital Marketing', skill_name: 'Data Analytics (GSC, GA4, Looker Studio)', proficiency_level: 95, display_order: 3 },
      { id: 'sk-4', category: 'Digital Marketing', skill_name: 'Inbound Content Strategy', proficiency_level: 90, display_order: 4 },
      { id: 'sk-5', category: 'Digital Marketing', skill_name: 'Social Media Campaigns & Meta Ads', proficiency_level: 88, display_order: 5 },
      { id: 'sk-6', category: 'Technical', skill_name: 'AI Assisted Web Development (HTML/CSS/JS/React)', proficiency_level: 85, display_order: 6 },
      { id: 'sk-7', category: 'Technical', skill_name: 'Graphic Design & Video Editing (Canva, Camtasia)', proficiency_level: 90, display_order: 7 },
      { id: 'sk-8', category: 'Soft Skills', skill_name: 'Analytical Problem-Solving', proficiency_level: 95, display_order: 8 }
    ],
    testimonials: [
      {
        id: 'test-1',
        client_name: 'Ahsan Kabir',
        company: 'Gloria Tech Ltd',
        position: 'Managing Director',
        quote: 'Pial transformed our search visibility completely. Our monthly traffic increased by 3.4x, and organic leads became our primary driver of customer acquisition. His understanding of AI-driven search engines is second to none.',
        image_url: '',
        rating: 5,
        featured: true
      },
      {
        id: 'test-2',
        client_name: 'Marcus Sterling',
        company: 'Apex Media USA',
        position: 'Founder',
        quote: 'Working with Pial remote was an absolute breeze. He managed our ad budget and achieved a 500% ROI on our Facebook retargeting campaigns. His daily tracking and transparency made him a trusted partner.',
        image_url: '',
        rating: 5,
        featured: true
      },
      {
        id: 'test-3',
        client_name: 'Rashedul Islam',
        company: 'Outbuild BD',
        position: 'Operations Lead',
        quote: 'Pial has a deep blend of technical skills and marketing psychology. He doesn\'t just get traffic; he converts visitors into paying customers. The revenue numbers speak for themselves.',
        image_url: '',
        rating: 5,
        featured: true
      }
    ],
    blog_posts: [
      {
        id: 'blog-1',
        slug: 'ai-seo-strategies-2026',
        title: 'The Future of Search: AI SEO Strategies for 2026',
        excerpt: 'How AI algorithms are changing indexing and how digital marketers can optimize for semantic search engines beyond keywords.',
        content: '<h2>The Shift from Keywords to Entities</h2><p>In 2026, standard search engine optimization has completely shifted away from simple keyword matches. Search systems analyze relationships between entities, semantic context, and user search vectors. Pial Mahmud advises restructuring blogs around intent clusters.</p><h2>How to Build Semantic Relevance</h2><p>To rank in modern search interfaces, including AI overview tools, your content must have: <ul><li>Expertise and direct experience (E-E-A-T)</li><li>Schema markup clearly defining entities</li><li>Clear Q&A structures for immediate ingestion</li></ul></p>',
        category: 'SEO',
        tags: ['AI SEO', 'Semantic Search', '2026 Trends'],
        featured_image: '/images/blog1.jpg',
        meta_title: 'AI SEO Strategies for 2026 | Digital Growth Insights',
        meta_description: 'Discover how AI algorithms are changing indexing and how to build semantic relevance for 2026. Insights by SEO expert Pial Mahmud.',
        focus_keyword: 'AI SEO Strategies',
        seo_score: 92,
        is_published: true,
        views: 312,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'blog-2',
        slug: 'cro-psychology-secrets',
        title: 'Conversion Rate Optimization: 5 Psychology Tricks to Reduce Bounce',
        excerpt: 'Understanding cognitive load, attention hooks, and the aesthetic-usability effect to double your website lead capture.',
        content: '<h2>1. The Aesthetic-Usability Effect</h2><p>Users perceive highly polished, premium designs as inherently more useful and credible than basic layouts. Reducing clutter decreases cognitive load, encouraging visitors to stay.</p><h2>2. Attention Anchors</h2><p>Direct the eyes of your visitors using contrast, glowing borders, and visual pathways. Place important CTA buttons at key decision-maker intervals.</p>',
        category: 'Growth Hacking',
        tags: ['CRO', 'User Psychology', 'Conversion Rate'],
        featured_image: '/images/blog2.jpg',
        meta_title: 'CRO Psychology: 5 Tricks to Boost Conversions | Pial Mahmud',
        meta_description: 'Learn the secrets of cognitive load and conversion psychology to double your website leads. Written by Growth Hacker Pial Mahmud.',
        focus_keyword: 'Conversion Rate Optimization',
        seo_score: 95,
        is_published: true,
        views: 184,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    services: [
      { id: 's-1', title: 'AI-Powered SEO Strategy', description: 'Transform search visibility using semantic entity mapping, natural language indexing alignment, and structured schemas.', icon: '🤖', price: '$999/mo', features: ['Competitor Entity Audits', 'Structured Schema Implementation', 'AI Content Workflow Design'], display_order: 1 },
      { id: 's-2', title: 'Data-Driven Paid Marketing', description: 'Scale advertising budget efficiently on Meta, Google, and LinkedIn with dynamic custom-audience retargeting loops.', icon: '📊', price: '$1200/mo', features: ['Server-side API tracking', 'Multi-channel attribution modeling', 'A/B landing page testing'], display_order: 2 },
      { id: 's-3', title: 'Growth Hacking & CRO', description: 'Engineer viral loops, micro-interactions, interactive calculators, and lead magnets to double signup conversion rates.', icon: '🚀', price: '$800/mo', features: ['Usability & friction audits', 'Interactive qualification form setup', 'Behavioral heatmaps setup'], display_order: 3 },
      { id: 's-4', title: 'Inbound Content Marketing', description: 'Architect high-authority topical clusters and authority assets that drive organic backlinks and direct buyer intent.', icon: '✍️', price: '$750/mo', features: ['Programmatic keywords search', 'Skyscraper building & outreach', 'E-E-A-T compliance review'], display_order: 4 },
      { id: 's-5', title: 'Social Media Management', description: 'Position founders and brands as authority voices on LinkedIn and Twitter with high-engagement carousel posts.', icon: '📱', price: '$600/mo', features: ['Visual asset templates', 'Weekly post copywriting schedule', 'Community building outreach'], display_order: 5 },
      { id: 's-6', title: 'Web Experience Optimization', description: 'Build responsive glassmorphic interfaces optimized for core web vitals, speed, mobile usability, and conversion psychology.', icon: '🌐', price: 'Custom', features: ['Next.js speed enhancements', 'Mobile responsive layouts', 'Framer motion micro-animations'], display_order: 6 }
    ],
    chatbot_knowledge: [
      { id: 'k-1', category: 'about', question: 'Who is Pial Mahmud?', answer: 'Pial Mahmud is an AI-powered Digital Marketer, Growth Hacker, and SEO Specialist who builds high-end digital experiences that convert visitors into revenue. He has over 5 years of industry experience.', ai_trained: true },
      { id: 'k-2', category: 'contact', question: 'How can I contact Pial?', answer: 'You can email Pial at hello@pialmahmud.com, reach out via WhatsApp at +8801718223748, or schedule a free 15-minute call directly through the contact form at the bottom of the homepage.', ai_trained: true },
      { id: 'k-3', category: 'services', question: 'What services does Pial offer?', answer: 'Pial offers AI-Powered SEO Strategy, Data-Driven Paid Marketing (Meta/Google Ads), Growth Hacking & CRO, Inbound Content Marketing, Social Media Brand Positioning, and Web Experience Optimization.', ai_trained: true },
      { id: 'k-4', category: 'experience', question: 'Where has Pial Mahmud worked?', answer: 'Pial has worked as an SEO Executive at Gloria Tech Ltd (driving 340% organic growth), a Digital Marketing Executive at Outbuild BD (doubling revenue in 6 months), and an Executive at TutorsPlane.', ai_trained: true },
      { id: 'k-5', category: 'rates', question: 'What are Pial\'s rates?', answer: 'Pial\'s SEO campaigns start at $999/month, paid ads management at $1200/month, and custom landing page designs vary by scope. Reach out to schedule a free custom quote session!', ai_trained: true }
    ],
    analytics_events: [],
    site_settings: [
      { id: 'set-1', key: 'logo_text', value: 'PM' },
      { id: 'set-2', key: 'hero_title', value: 'Engineering Digital Growth Beyond the Algorithm.' },
      { id: 'set-3', key: 'hero_subtitle', value: 'AI Specialist | Data-Driven Digital Marketer | SEO Growth Hacker' },
      { id: 'set-4', key: 'whatsapp_url', value: 'https://wa.me/8801718223748' },
      { id: 'set-5', key: 'linkedin_url', value: 'https://www.linkedin.com/in/pial-mahmud-' },
      { id: 'set-6', key: 'profile_image', value: '/images/pial-photo.jpg' },
      { id: 'set-7', key: 'email', value: 'hello@pialmahmud.com' },
      { id: 'set-8', key: 'phone', value: '+8801718223748' },
      { id: 'set-9', key: 'location', value: 'Dhaka, Bangladesh' }
    ],
    contact_messages: [],
    newsletter_subs: [],
    home_content: [
      {
        id: 'hc-stats',
        section: 'stats',
        data: [
          { num: 50, suffix: '+', label: 'Projects Delivered', icon: '🚀' },
          { num: 7, suffix: '', label: 'Brand Clients', icon: '🏢' },
          { num: 412, suffix: '%', label: 'Max Traffic Growth', icon: '📈' },
          { num: 5, suffix: '.0★', label: 'Client Rating', icon: '⭐' }
        ]
      },
      {
        id: 'hc-clients',
        section: 'clients',
        data: [
          { name: 'TutorsPlan', logo: '/images/clients/tutorsplan.svg', tag: 'EdTech' },
          { name: 'KDGTAL', logo: '/images/clients/kdgtal.svg', tag: 'Digital Agency' },
          { name: 'Mister Berry', logo: '/images/clients/misterberry.svg', tag: 'F&B Brand' },
          { name: 'Bashundhara Housing', logo: '/images/clients/bashundhara.svg', tag: 'Real Estate' },
          { name: 'Outbuild', logo: '/images/clients/outbuild.svg', tag: 'Construction' },
          { name: 'TVHUT', logo: '/images/clients/tvhut.svg', tag: 'Media & Entertainment' },
          { name: 'Hena Technology', logo: '/images/clients/hena.svg', tag: 'Tech Company' }
        ]
      },
      {
        id: 'hc-testimonials',
        section: 'testimonials',
        data: [
          { name: 'Sarah Thompson', title: 'CEO, TutorsPlan UK', text: 'Pial transformed our online presence completely. The SEO results exceeded every expectation — we went from page 5 to position 1 for our core keywords.', rating: 5 },
          { name: 'David Chen', title: 'Marketing Director, Outbuild', text: 'Working with Pial was the best marketing investment we made. His AI-powered strategies gave us a competitive edge that our competitors are still catching up to.', rating: 5 },
          { name: 'Rashida Khanam', title: 'Brand Head, Bashundhara Housing', text: 'Exceptional results, professional execution, and always ahead of deadlines. Pial is not just a marketer — he is a strategic growth partner.', rating: 5 }
        ]
      }
    ],
    work_items: [
      {
        id: '1',
        category: 'analytics',
        title: 'TutorsPlan UK — 412% Traffic Growth',
        description: 'Google Analytics dashboard showing 412% organic traffic increase over 12 months for a UK EdTech platform.',
        type: 'image',
        imageUrl: '/uploads/455871325_122115963698391953_2577993616113102870_n.jpg'
      },
      {
        id: '2',
        category: 'search_console',
        title: '#1 Rankings — 200+ Keywords',
        description: 'Search Console data showing top 3 positions achieved for 200+ target keywords in the tutoring niche.',
        type: 'image',
        imageUrl: '/uploads/455871325_122115963698391953_2577993616113102870_n.jpg'
      },
      {
        id: '3',
        category: 'meta_ads',
        title: 'E-commerce ROAS 4.8x',
        description: 'Meta Ads Manager results for a fashion brand achieving 4.8x ROAS with a £15,000 monthly ad spend.',
        type: 'image',
        imageUrl: '/uploads/455871325_122115963698391953_2577993616113102870_n.jpg'
      },
      {
        id: '4',
        category: 'google_ads',
        title: 'Lead Gen — 62% Cost Reduction',
        description: 'Google Ads campaign optimization reducing cost-per-lead by 62% while maintaining conversion volume.',
        type: 'image',
        imageUrl: '/uploads/455871325_122115963698391953_2577993616113102870_n.jpg'
      },
      {
        id: '5',
        category: 'ai_projects',
        title: 'AI SEO Portfolio Platform',
        description: 'This AI-powered portfolio was built using Next.js + Gemini AI assistant with live SEO auditing capabilities.',
        linkUrl: '/',
        type: 'link'
      }
    ]
  };
};

// Database class
export class JsonDb {
  private static cache: DbSchema | null = null;

  private static readRaw(): DbSchema {
    if (this.cache) return this.cache;
    try {
      if (!fs.existsSync(DB_DIR)) {
        try { fs.mkdirSync(DB_DIR, { recursive: true }); } catch {}
      }
      if (!fs.existsSync(DB_FILE)) {
        const data = getInitialData();
        try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8'); } catch {}
        this.cache = data;
        return data;
      }

      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      const initial = getInitialData();
      let changed = false;
      for (const key of Object.keys(initial) as (keyof DbSchema)[]) {
        if (!parsed[key]) {
          parsed[key] = initial[key];
          changed = true;
        }
      }
      if (Array.isArray(parsed.users)) {
        for (const u of parsed.users) {
          if (u.password_hash && !u.password_hash.startsWith('$2')) {
            u.password_hash = initial.users[0].password_hash;
            changed = true;
          }
        }
      }
      if (Array.isArray(parsed.projects)) {
        const seedBySlug: Record<string, any> = {};
        for (const p of initial.projects) seedBySlug[p.slug || p.case_study] = p;
        for (const p of parsed.projects) {
          const key = p.slug || p.case_study;
          const seed = seedBySlug[key];
          if (seed) {
            if (!p.slug) { p.slug = seed.slug; changed = true; }
            if (!p.client) { p.client = seed.client; changed = true; }
            if (!p.tag) { p.tag = seed.tag; changed = true; }
            if (!p.meta_title) { p.meta_title = seed.meta_title; changed = true; }
            if (!p.meta_description) { p.meta_description = seed.meta_description; changed = true; }
            if (!p.focus_keyword) { p.focus_keyword = seed.focus_keyword; changed = true; }
          } else if (!p.slug) {
            p.slug = (p.title || 'case-study').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            changed = true;
          }
        }
      }
      if (Array.isArray(parsed.pages) && parsed.pages.length < initial.pages.length) {
        const existingSlugs = new Set(parsed.pages.map((p: any) => p.slug));
        for (const p of initial.pages) {
          if (!existingSlugs.has(p.slug)) {
            parsed.pages.push({ ...p, created_at: new Date().toISOString() });
            changed = true;
          }
        }
      }
      if (changed) {
        try { fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8'); } catch {}
      }
      this.cache = parsed;
      return parsed;
    } catch (e) {
      console.error('Error reading database, using fallback initial data', e);
      const data = getInitialData();
      this.cache = data;
      return data;
    }
  }

  private static writeRaw(data: DbSchema) {
    this.cache = data;
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('FS write skipped on read-only serverless environment:', e);
    }
  }

  public static getCollection(name: keyof DbSchema): any[] {
    const db = this.readRaw();
    return db[name] || [];
  }

  public static saveCollection(name: keyof DbSchema, items: any[]) {
    const db = this.readRaw();
    db[name] = items;
    this.writeRaw(db);
  }

  public static insert(name: keyof DbSchema, item: any): any {
    const items = this.getCollection(name);
    const newItem = {
      id: `${name.substring(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      ...item
    };
    items.push(newItem);
    this.saveCollection(name, items);
    return newItem;
  }

  public static update(name: keyof DbSchema, id: string, updates: any): boolean {
    const items = this.getCollection(name);
    const index = items.findIndex(x => x.id === id || x.key === id);
    if (index === -1) return false;

    items[index] = {
      ...items[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveCollection(name, items);
    return true;
  }

  public static delete(name: keyof DbSchema, id: string): boolean {
    const items = this.getCollection(name);
    const filtered = items.filter(x => x.id !== id && x.key !== id);
    if (items.length === filtered.length) return false;

    this.saveCollection(name, filtered);
    return true;
  }

  // ─── Settings helpers (key/value store) ─────────────────────────────────

  public static getAllSettings(): Record<string, any> {
    const items = this.getCollection('site_settings');
    const map: Record<string, any> = {};
    for (const s of items) map[s.key] = s.value;
    return map;
  }

  public static getSetting(key: string, fallback: any = null): any {
    const items = this.getCollection('site_settings');
    const found = items.find(s => s.key === key);
    return found ? found.value : fallback;
  }

  public static setSetting(key: string, value: any): void {
    const items = this.getCollection('site_settings');
    const index = items.findIndex(s => s.key === key);
    if (index === -1) {
      items.push({ id: `set-${Date.now()}`, key, value, updated_at: new Date().toISOString() });
    } else {
      items[index] = { ...items[index], value, updated_at: new Date().toISOString() };
    }
    this.saveCollection('site_settings', items);
  }
}
