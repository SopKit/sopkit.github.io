import fs from 'fs';
import path from 'path';

// This script generates RSS and Atom feeds
const generateRssParams = {
  title: "SopKit - Developer Tools",
  site_url: "https://sopkit.github.io",
  description: "Free, open-source developer tools and utilities.",
  author: "SopKit Team"
};

const tools = require('../src/data/tools.json');
const publicDir = path.join(process.cwd(), 'public');

function generateRss() {
  const items = tools.map(tool => `
    <item>
      <title><![CDATA[${tool.name}]]></title>
      <link>${generateRssParams.site_url}${tool.link}</link>
      <description><![CDATA[${tool.description}]]></description>
      <guid>${generateRssParams.site_url}${tool.link}</guid>
      <category>${tool.category}</category>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${generateRssParams.title}</title>
    <link>${generateRssParams.site_url}</link>
    <description>${generateRssParams.description}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss);
  console.log('RSS feed generated.');
}

function generateAtom() {
  const items = tools.map(tool => `
    <entry>
      <title>${tool.name}</title>
      <link href="${generateRssParams.site_url}${tool.link}" />
      <id>${generateRssParams.site_url}${tool.link}</id>
      <updated>${new Date().toISOString()}</updated>
      <summary>${tool.description}</summary>
    </entry>
  `).join('');

  const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${generateRssParams.title}</title>
  <link href="${generateRssParams.site_url}" />
  <updated>${new Date().toISOString()}</updated>
  <id>${generateRssParams.site_url}</id>
  ${items}
</feed>`;

  fs.writeFileSync(path.join(publicDir, 'atom.xml'), atom);
  console.log('Atom feed generated.');
}

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

generateRss();
generateAtom();
