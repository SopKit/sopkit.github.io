'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function JSONtoTypeScript() {
  const [json, setJson] = React.useState('');
  const [typescript, setTypescript] = React.useState('');

  const generateInterface = () => {
    try {
      const parsedJson = JSON.parse(json);
      const interfaces = generateTypeScriptInterfaces(parsedJson, 'RootInterface');
      setTypescript(interfaces);
    } catch (error) {
      setTypescript(`Error: ${error.message}`);
    }
  };

  const generateTypeScriptInterfaces = (obj, interfaceName) => {
    const seen = new Set();

    const generateInterface = (obj, name) => {
      if (seen.has(name)) return '';
      seen.add(name);

      const properties = [];
      const nestedInterfaces = [];

      Object.entries(obj).forEach(([key, value]) => {
        const type = getTypeScriptType(value, `${name}${capitalize(key)}`);
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          nestedInterfaces.push(generateInterface(value, `${name}${capitalize(key)}`));
        }
        properties.push(`  ${key}: ${type};`);
      });

      return `${nestedInterfaces.join('\n\n')}${nestedInterfaces.length ? '\n\n' : ''}interface ${name} {\n${properties.join('\n')}\n}`;
    };

    const getTypeScriptType = (value, interfaceName) => {
      if (value === null) return 'null';
      if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]';
        const itemType = getTypeScriptType(value[0], interfaceName);
        return `${itemType}[]`;
      }
      if (typeof value === 'object') return interfaceName;
      return typeof value;
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return generateInterface(obj, interfaceName);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">JSON to TypeScript Converter</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">JSON Input</h2>
          <Textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder="Paste your JSON here..."
            className="h-[400px] font-mono"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">TypeScript Interfaces</h2>
          <Textarea
            value={typescript}
            readOnly
            placeholder="Your TypeScript interfaces will appear here..."
            className="h-[400px] font-mono bg-gray-50"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          onClick={generateInterface}
          className="px-8 py-2"
          disabled={!json}
        >
          Generate TypeScript
        </Button>
      </div>
    </div>
  );
}