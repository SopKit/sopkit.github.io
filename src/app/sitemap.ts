import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sopkit.github.io'
  
  // Static pages with enhanced SEO priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tos/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dmca/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]
  
  // High-priority tool pages
  const toolSlugs = [
    'markdown-to-html',
    'html-to-markdown', 
    'html-to-jsx',
    'encoding',
    'web-tools',
    'play-piano',
    'daily-todo-app',
    'audio-recorder',
    'file-converter',
    'json-formatter',
    'url-encoder',
    'base64-encoder',
    'hash-generator',
    'password-generator',
    'color-picker',
    'code-formatter',
    'minifier',
    'beautifier',
    'regex-tester',
    'lorem-ipsum',
    'timestamp-converter',
    'qr-generator',
    'image-compressor',
    'css-generator',
    'gradient-generator'
  ]

  const toolPages = toolSlugs.map(tool => ({
    url: `${baseUrl}/${tool}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // Category pages for better organization
  const categoryPages = [
    'converters',
    'generators',
    'validators',
    'formatters',
    'encoders',
    'development-tools',
    'web-utilities'
  ].map(category => ({
    url: `${baseUrl}/category/${category}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  return [...staticPages, ...toolPages, ...categoryPages]
}
