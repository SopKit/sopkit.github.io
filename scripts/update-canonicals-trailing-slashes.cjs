const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '../src/app');

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js'))) {
      callback(filePath);
    }
  }
}

function updateCanonicals() {
  console.log('🔄 Scanning app directory for canonical URLs...');
  let modifiedCount = 0;

  walkDir(APP_DIR, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Regexp to match alternates: { canonical: "url" } or canonical: "url"
    // Capture group 1: quotes/backticks, group 2: the url itself
    // e.g. canonical: "https://sopkit.github.io/something"
    content = content.replace(/canonical:\s*(["'`])(https:\/\/sopkit\.github\.io\/[^"'`]*)\1/g, (match, quote, url) => {
      // If it already ends with a slash, or contains a file extension / parameter / hash, don't change
      if (url.endsWith('/') || url.includes('?') || url.includes('#') || url.includes('${') || /\.[a-z0-9]+$/i.test(url)) {
        return match;
      }
      modified = true;
      console.log(`  Updating static canonical: ${url} -> ${url}/ in ${path.relative(APP_DIR, filePath)}`);
      return `canonical: ${quote}${url}/${quote}`;
    });

    // Also update dynamic template literal canonicals:
    // e.g. canonical: `https://sopkit.github.io/blog/${article.slug}`
    content = content.replace(/canonical:\s*`https:\/\/sopkit\.github\.io\/([^`]+)`/g, (match, pathPart) => {
      // If it already ends with / or has query/extension, don't change
      if (pathPart.endsWith('/') || pathPart.endsWith('}/') || pathPart.includes('?') || pathPart.includes('#') || /\.[a-z0-9]+$/i.test(pathPart)) {
        return match;
      }
      modified = true;
      console.log(`  Updating dynamic canonical: .../${pathPart} -> .../${pathPart}/ in ${path.relative(APP_DIR, filePath)}`);
      return `canonical: \`https://sopkit.github.io/${pathPart}/\``;
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedCount++;
    }
  });

  console.log(`\n✅ Completed! Modified ${modifiedCount} files.`);
}

updateCanonicals();
