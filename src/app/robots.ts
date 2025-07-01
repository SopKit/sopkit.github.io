import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0.5,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 0.5,
      },
      {
        userAgent: 'Slurp',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        crawlDelay: 0.5,
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: 'https://sopkit.github.io/sitemap.xml',
    host: 'https://sopkit.github.io',
  }
}
