const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'out');

if (!fs.existsSync(OUT_DIR)) {
    console.error(`❌ Build output directory 'out/' not found. Please run 'npm run build' first.`);
    process.exit(1);
}

console.log('🔍 Starting local static link crawler in out/ directory...');

const allFiles = [];
function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.html')) {
            allFiles.push(fullPath);
        }
    });
}

walk(OUT_DIR);
console.log(`📄 Found ${allFiles.length} HTML files to scan.`);

const brokenLinks = [];
let scannedLinksCount = 0;

allFiles.forEach(file => {
    const relativePath = path.relative(OUT_DIR, file);
    const content = fs.readFileSync(file, 'utf8');
    
    // Extract all href values
    const hrefRegex = /href=["']([^"']+)["']/g;
    let match;
    
    while ((match = hrefRegex.exec(content)) !== null) {
        let link = match[1];
        
        // Only verify internal root-relative links (e.g., /image-compressor or /image-compressor/)
        if (link.startsWith('/') && !link.startsWith('//')) {
            // Strip hash and query params
            const cleanLink = link.split('#')[0].split('?')[0];
            if (!cleanLink || cleanLink === '/') continue;
            
            scannedLinksCount++;
            
            // Resolve path relative to OUT_DIR
            // In Next.js with trailingSlash: true:
            // /some-route/ maps to out/some-route/index.html
            // /some-route maps to out/some-route/index.html (or out/some-route.html if no trailingSlash)
            const routeWithoutLeading = cleanLink.replace(/^\//, '');
            
            // Try standard index.html path: out/some-route/index.html
            const indexPath = path.join(OUT_DIR, routeWithoutLeading, 'index.html');
            // Try direct html path: out/some-route.html
            const directHtmlPath = path.join(OUT_DIR, `${routeWithoutLeading}.html`);
            // Try static file path (assets, sitemap.xml, favicon.ico)
            const assetPath = path.join(OUT_DIR, routeWithoutLeading);
            
            const exists = fs.existsSync(indexPath) || fs.existsSync(directHtmlPath) || fs.existsSync(assetPath);
            
            if (!exists) {
                brokenLinks.push({
                    sourceFile: relativePath,
                    targetLink: link,
                    cleanLink
                });
            }
        }
    }
});

console.log(`\n✅ Scanned ${scannedLinksCount} internal links across ${allFiles.length} HTML files.`);

if (brokenLinks.length === 0) {
    console.log('🎉 Hurrah! No broken internal 404 links found on the website!');
} else {
    console.log(`⚠️ Found ${brokenLinks.length} broken links:`);
    
    // Group by target link to keep it tidy
    const grouped = {};
    brokenLinks.forEach(b => {
        if (!grouped[b.targetLink]) {
            grouped[b.targetLink] = [];
        }
        grouped[b.targetLink].push(b.sourceFile);
    });
    
    Object.keys(grouped).forEach(target => {
        console.log(`🔗 Broken Link: ${target}`);
        console.log(`   referenced in ${grouped[target].length} files (e.g. ${grouped[target][0]})`);
    });
}
