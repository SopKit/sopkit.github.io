'use client';
import React from 'react';
import { Input } from '@/components/ui/input';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const tools = {
    'Code Conversion': [
      { name: 'HTML to JSX', description: 'Convert HTML markup to React JSX syntax', path: '/tools/html-to-jsx' },
      { name: 'JSON to TypeScript', description: 'Generate TypeScript interfaces from JSON', path: '/tools/json-to-ts' },
      { name: 'CSS to JS Objects', description: 'Convert CSS to JavaScript style objects', path: '/tools/css-to-js' },
      { name: 'YAML to JSON', description: 'Convert YAML to JSON format', path: '/tools/yaml-to-json' },
      { name: 'Markdown to HTML', description: 'Convert Markdown to HTML markup', path: '/tools/md-to-html' },
      { name: 'SVG to JSX', description: 'Convert SVG files to React components', path: '/tools/svg-to-jsx' },
      { name: 'CSV to JSON', description: 'Convert CSV data to JSON format', path: '/tools/csv-to-json' },
      { name: 'JSON to YAML', description: 'Convert JSON to YAML format', path: '/tools/json-to-yaml' },
      { name: 'XML to JSON', description: 'Convert XML to JSON format', path: '/tools/xml-to-json' },
      { name: 'CSS to SCSS', description: 'Convert CSS to SCSS syntax', path: '/tools/css-to-scss' }
    ],
    'Text Processing': [
      { name: 'Base64 Encoder/Decoder', description: 'Encode or decode Base64 strings', path: '/tools/base64' },
      { name: 'URL Encoder/Decoder', description: 'Encode or decode URL strings', path: '/tools/url-codec' },
      { name: 'JSON Formatter', description: 'Format and validate JSON data', path: '/tools/json-formatter' },
      { name: 'Minify JS/CSS', description: 'Minify JavaScript and CSS code', path: '/tools/minifier' },
      { name: 'String Hash Generator', description: 'Generate MD5, SHA-1, SHA-256 hashes', path: '/tools/hash-gen' },
      { name: 'Text Diff Checker', description: 'Compare text differences', path: '/tools/diff-checker' },
      { name: 'RegEx Tester', description: 'Test and validate regular expressions', path: '/tools/regex-tester' },
      { name: 'JWT Decoder', description: 'Decode JWT tokens', path: '/tools/jwt-decoder' },
      { name: 'Unicode Converter', description: 'Convert text to/from Unicode', path: '/tools/unicode' },
      { name: 'HTML Entity Encoder', description: 'Convert special characters to HTML entities', path: '/tools/html-entities' }
    ],
    'Development Utilities': [
      { name: 'Color Picker', description: 'Pick and convert colors in different formats', path: '/tools/color-picker' },
      { name: 'Gradient Generator', description: 'Create CSS gradients', path: '/tools/gradient-gen' },
      { name: 'Cron Expression Generator', description: 'Generate cron expressions', path: '/tools/cron-gen' },
      { name: 'Lorem Ipsum Generator', description: 'Generate placeholder text', path: '/tools/lorem-ipsum' },
      { name: 'UUID Generator', description: 'Generate UUIDs/GUIDs', path: '/tools/uuid-gen' },
      { name: 'Password Generator', description: 'Generate secure passwords', path: '/tools/password-gen' },
      { name: 'Meta Tags Generator', description: 'Generate HTML meta tags', path: '/tools/meta-tags' },
      { name: 'Favicon Generator', description: 'Create favicons from images', path: '/tools/favicon-gen' },
      { name: 'CSS Grid Generator', description: 'Create CSS grid layouts', path: '/tools/grid-gen' },
      { name: 'Box Shadow Generator', description: 'Generate CSS box shadows', path: '/tools/shadow-gen' }
    ],
    'Media Tools': [
      { name: 'Image to Base64', description: 'Convert images to Base64 strings', path: '/tools/img-to-base64' },
      { name: 'SVG Optimizer', description: 'Optimize SVG files', path: '/tools/svg-optimizer' },
      { name: 'Image Color Extractor', description: 'Extract colors from images', path: '/tools/color-extract' },
      { name: 'QR Code Generator', description: 'Generate QR codes', path: '/tools/qr-gen' },
      { name: 'Image Resizer', description: 'Resize images online', path: '/tools/img-resize' },
      { name: 'WebP Converter', description: 'Convert images to WebP format', path: '/tools/webp-convert' },
      { name: 'Image Compressor', description: 'Compress images for web', path: '/tools/img-compress' },
      { name: 'Audio Converter', description: 'Convert audio formats', path: '/tools/audio-convert' },
      { name: 'Video Thumbnail Generator', description: 'Generate video thumbnails', path: '/tools/video-thumb' },
      { name: 'Image Watermark', description: 'Add watermarks to images', path: '/tools/watermark' }
    ],
    'API & Testing': [
      { name: 'API Tester', description: 'Test REST API endpoints', path: '/tools/api-tester' },
      { name: 'Mock Data Generator', description: 'Generate mock JSON data', path: '/tools/mock-data' },
      { name: 'GraphQL Query Builder', description: 'Build and test GraphQL queries', path: '/tools/graphql-builder' },
      { name: 'WebSocket Tester', description: 'Test WebSocket connections', path: '/tools/websocket-test' },
      { name: 'HTTP Headers Tester', description: 'Test HTTP headers', path: '/tools/header-test' },
      { name: 'CORS Tester', description: 'Test CORS configurations', path: '/tools/cors-test' },
      { name: 'SSL Checker', description: 'Verify SSL certificates', path: '/tools/ssl-check' },
      { name: 'DNS Lookup', description: 'Perform DNS lookups', path: '/tools/dns-lookup' },
      { name: 'Port Scanner', description: 'Scan open ports', path: '/tools/port-scan' },
      { name: 'Load Time Analyzer', description: 'Analyze website load times', path: '/tools/load-analyzer' }
    ]
  };

  const filteredTools = Object.entries(tools).reduce((acc, [category, items]) => {
    const filtered = items.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Developer Tools</h1>
        <Input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xl"
        />
      </div>

      <div className="grid gap-8">
        {Object.entries(filteredTools).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((tool) => (
                <div
                  key={tool.name}
                  className="p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
                >
                  <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                  <a
                    href={tool.path}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:hover:bg-blue-800"
                  >
                    Try Tool
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
