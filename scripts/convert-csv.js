const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const csvPath = path.join(process.cwd(), 'src/data/tools.csv');
const jsonPath = path.join(process.cwd(), 'src/data/tools.json');

const csvFile = fs.readFileSync(csvPath, 'utf8');

Papa.parse(csvFile, {
  header: true,
  complete: function(results) {
    const tools = results.data
      .filter(item => item.name && item.link) // Filter empty rows
      .map(item => ({
        name: item.name.trim(),
        description: item.description?.trim() || '',
        link: item.link.trim().replace(/^\./, ''),
        icon: item.icon?.trim() || 'Box', // Default icon
        category: item.category?.trim() || 'Utilities',
        featured: item.featured === 'TRUE'
      }));

    fs.writeFileSync(jsonPath, JSON.stringify(tools, null, 2));
    console.log(`Successfully converted ${tools.length} tools to tools.json`);
  }
});
