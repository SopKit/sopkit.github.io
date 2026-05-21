'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function CSStoJSConverter() {
  const [css, setCss] = React.useState('');
  const [jsObject, setJsObject] = React.useState('');

  const convertToJS = () => {
    try {
      const cssRules = css
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.includes('{') && !line.includes('}'));

      const jsStyles = cssRules.reduce((acc, rule) => {
        if (rule.includes(':')) {
          const [property, value] = rule.split(':').map(part => part.trim().replace(';', ''));
          const camelCaseProperty = property
            .replace(/-([a-z])/g, g => g[1].toUpperCase())
            .replace(/^-/, '');
          acc[camelCaseProperty] = value;
        }
        return acc;
      }, {});

      setJsObject(JSON.stringify(jsStyles, null, 2));
    } catch (error) {
      setJsObject(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CSS to JavaScript Style Objects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">CSS Input</h2>
          <Textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder="Paste your CSS here..."
            className="h-[400px] font-mono"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">JavaScript Style Object</h2>
          <Textarea
            value={jsObject}
            readOnly
            placeholder="Your JavaScript style object will appear here..."
            className="h-[400px] font-mono bg-gray-50"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          onClick={convertToJS}
          className="px-8 py-2"
          disabled={!css}
        >
          Convert to JS
        </Button>
      </div>
    </div>
  );
}