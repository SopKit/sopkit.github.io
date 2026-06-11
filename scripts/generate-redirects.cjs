const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../src/constants/tools.json');
const redirectsPath = path.join(__dirname, '../public/_redirects');

function generateRedirects() {
    console.log('🚀 Generating redirects from extraSlugs...');
    
    const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'));
    let redirectCount = 0;
    
    // Start with existing content or header
    let content = `# =============================================================================
# Cloudflare Pages _redirects file (AUTO-GENERATED)
# Generated on: ${new Date().toISOString()}
# =============================================================================

# Manual Redirects
/image-compressor-online /image-compressor 301
/pdf-to-word-converter /pdf-to-word 301

# Programmatic extraSlugs Redirects
`;

    // Process categories and tools
    Object.values(toolsData.categories).forEach(category => {
        category.tools.forEach(tool => {
            if (tool.extraSlugs && Array.from(new Set(tool.extraSlugs)).length > 0) {
                const target = tool.route;
                // Remove duplicates and self-references
                const uniqueSlugs = [...new Set(tool.extraSlugs)].filter(slug => {
                    const slugPath = slug.startsWith('/') ? slug : `/${slug}`;
                    return slugPath !== target;
                });

                uniqueSlugs.forEach(slug => {
                    const source = slug.startsWith('/') ? slug : `/${slug}`;
                    content += `${source} ${target} 301\n`;
                    redirectCount++;
                });
            }
        });
    });

    fs.writeFileSync(redirectsPath, content);
    console.log(`✅ Successfully generated ${redirectCount} redirects in public/_redirects`);
}

generateRedirects();
