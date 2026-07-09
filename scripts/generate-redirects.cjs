const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const toolsPath = path.join(BASE_DIR, 'src/constants/tools.json');
const publicRedirectsPath = path.join(BASE_DIR, 'public/_redirects');
const outDir = path.join(BASE_DIR, 'out');

function generateRedirects() {
    console.log('🚀 Generating redirects from extraSlugs...');
    
    if (!fs.existsSync(toolsPath)) {
        console.error(`❌ tools.json not found at ${toolsPath}`);
        return;
    }

    const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
    let redirectCount = 0;
    
    // Start with existing content or header
    let redirectsContent = `# =============================================================================
# Cloudflare Pages _redirects file (AUTO-GENERATED)
# Generated on: ${new Date().toISOString()}
# =============================================================================

# Manual Redirects
/image-compressor-online /image-compressor/ 301
/pdf-to-word-converter /pdf-to-word/ 301

# Programmatic extraSlugs Redirects
`;

    const allRedirects = [];

    // Process categories and tools
    Object.values(toolsData.categories).forEach(category => {
        category.tools.forEach(tool => {
            if (tool.extraSlugs && Array.from(new Set(tool.extraSlugs)).length > 0) {
                const target = tool.route.endsWith('/') ? tool.route : `${tool.route}/`;
                // Remove duplicates and self-references
                const uniqueSlugs = [...new Set(tool.extraSlugs)].filter(slug => {
                    const slugPath = slug.startsWith('/') ? slug : `/${slug}`;
                    const cleanSlugPath = slugPath.endsWith('/') ? slugPath : `${slugPath}/`;
                    return cleanSlugPath !== target;
                });

                uniqueSlugs.forEach(slug => {
                    const source = slug.startsWith('/') ? slug : `/${slug}`;
                    const sourceWithSlash = source.endsWith('/') ? source : `${source}/`;
                    
                    redirectsContent += `${source} ${target} 301\n`;
                    allRedirects.push({ source: sourceWithSlash, target });
                    redirectCount++;
                });
            }
        });
    });

    // Write public/_redirects
    fs.writeFileSync(publicRedirectsPath, redirectsContent);
    console.log(`\n✅ Successfully generated ${redirectCount} redirects in public/_redirects`);

    // Write static HTML redirect pages in out/ directory for GitHub Pages
    if (fs.existsSync(outDir)) {
        console.log(`📁 Found build output directory: ${outDir}. Generating static HTML redirects...`);
        
        // Write out/_redirects for Cloudflare
        fs.writeFileSync(path.join(outDir, '_redirects'), redirectsContent);

        let htmlCount = 0;
        allRedirects.forEach(({ source, target }) => {
            const folderPath = path.join(outDir, source);
            try {
                fs.mkdirSync(folderPath, { recursive: true });
                const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${target}">
    <link rel="canonical" href="https://sopkit.github.io${target}">
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Redirecting to <a href="${target}">https://sopkit.github.io${target}</a>...</p>
  </body>
</html>`;
                fs.writeFileSync(path.join(folderPath, 'index.html'), htmlContent);
                htmlCount++;
            } catch (err) {
                console.error(`Failed to create redirect for ${source}:`, err.message);
            }
        });
        console.log(`✅ Successfully generated ${htmlCount} static HTML redirect pages in out/`);
    } else {
        console.log(`⚠️ Build output directory 'out' not found. Skipping static HTML redirect generation. Run this script AFTER 'next build'.`);
    }
}

generateRedirects();
