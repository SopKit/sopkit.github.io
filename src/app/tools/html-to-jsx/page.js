'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function HTMLtoJSXConverter() {
  const [html, setHtml] = React.useState('');
  const [jsx, setJsx] = React.useState('');

  const convertToJSX = () => {
    // Basic HTML to JSX conversion
    let converted = html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      // Convert inline styles
      .replace(/style="([^"]*)"/g, (match, styles) => {
        const jsxStyles = styles
          .split(';')
          .filter(style => style.length > 0)
          .reduce((acc, style) => {
            const [property, value] = style.split(':');
            if (property && value) {
              // Convert property to camelCase
              const jsxProperty = property.trim()
                .replace(/-([a-z])/g, g => g[1].toUpperCase());
              acc[jsxProperty] = value.trim();
            }
            return acc;
          }, {});
        return `style={${JSON.stringify(jsxStyles)}}`;
      });

    setJsx(converted);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">HTML to JSX Converter</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">HTML Input</h2>
          <Textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Paste your HTML here..."
            className="h-[400px] font-mono"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">JSX Output</h2>
          <Textarea
            value={jsx}
            readOnly
            placeholder="Your JSX will appear here..."
            className="h-[400px] font-mono bg-gray-50"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          onClick={convertToJSX}
          className="px-8 py-2"
          disabled={!html}
        >
          Convert to JSX
        </Button>
      </div>
    </div>
  );
}