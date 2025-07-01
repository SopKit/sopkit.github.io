/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sopkit.github.io',
  generateRobotsTxt: false, // We have a custom robots.ts
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/404',
    '/500',
    '/api/*',
    '/admin/*',
    '/private/*',
    '/_next/*',
  ],
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customPaths = {
      '/': { priority: 1.0, changefreq: 'daily' },
      '/about': { priority: 0.9, changefreq: 'monthly' },
      '/tools': { priority: 0.9, changefreq: 'weekly' },
      '/privacy': { priority: 0.3, changefreq: 'yearly' },
      '/tos': { priority: 0.3, changefreq: 'yearly' },
      '/dmca': { priority: 0.3, changefreq: 'yearly' },
    };

    // Tool pages get high priority
    const toolPages = [
      '/markdown-to-html',
      '/html-to-jsx',
      '/html-to-markdown',
      '/encoding',
      '/web-tools',
      '/json-formatter',
      '/play-piano',
      '/daily-todo-app',
      '/audio-recorder',
      '/file-converter'
    ];

    if (toolPages.includes(path)) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        alternateRefs: config.alternateRefs ?? [],
      };
    }

    const customPath = customPaths[path];
    if (customPath) {
      return {
        loc: path,
        changefreq: customPath.changefreq,
        priority: customPath.priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        alternateRefs: config.alternateRefs ?? [],
      };
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async (config) => {
    const result = [];

    // Add category pages
    const categories = [
      'converters',
      'generators', 
      'validators',
      'formatters',
      'encoders',
      'development-tools',
      'web-utilities'
    ];

    categories.forEach(category => {
      result.push({
        loc: `/category/${category}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0.5,
      },
    ],
    additionalSitemaps: [
      'https://sopkit.github.io/sitemap.xml',
    ],
  },
};
