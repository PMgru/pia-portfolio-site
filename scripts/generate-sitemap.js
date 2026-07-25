const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pialmahmud.com';
const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`DB file not found at ${DB_PATH}`);
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function buildSitemap(db) {
  const staticUrls = ['/', '/about', '/services', '/case-studies', '/blog', '/contact'];
  const urls = staticUrls.map((slug) => ({
    loc: `${BASE_URL}${slug}`,
    lastmod: new Date().toISOString(),
  }));

  const blogUrls = (db.blog_posts || [])
    .filter((post) => post.is_published)
    .map((post) => ({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: post.updated_at || post.created_at || new Date().toISOString(),
    }));

  const caseStudyUrls = (db.projects || [])
    .filter((project) => project.slug)
    .map((project) => ({
      loc: `${BASE_URL}/case-studies/${project.slug}`,
      lastmod: project.updated_at || project.created_at || new Date().toISOString(),
    }));

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...urls,
    ...blogUrls,
    ...caseStudyUrls,
  ]
    .map((entry) => {
      return `  <url>\n    <loc>${entry.loc}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}\n  </url>`;
    })
    .join('\n')}\n</urlset>`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nDisallow: /_next\nSitemap: ${BASE_URL}/sitemap.xml\n`;
}

function writeFile(fileName, content) {
  const destination = path.join(PUBLIC_DIR, fileName);
  fs.writeFileSync(destination, content, 'utf-8');
  console.log(`Wrote ${destination}`);
}

function main() {
  const db = readDb();
  const sitemapContent = buildSitemap(db);
  const robotsContent = buildRobots();

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  writeFile('sitemap.xml', sitemapContent);
  writeFile('robots.txt', robotsContent);
}

main();
