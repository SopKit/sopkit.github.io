import SqlFormatter from '@/components/tools/SqlFormatter';

export const metadata = {
  title: 'SQL Formatter & Beautifier | Online SQL Prettifier',
  description: 'Format and beautify your SQL queries online. Supports Standard SQL, MySQL, PostgreSQL, and BigQuery. Free and secure tool.',
  keywords: 'sql formatter, sql beautifier, pretzel sql, format sql online, sql indenter, database tools, developer utilities',
  openGraph: {
    title: 'SQL Formatter & Beautifier | Online SQL Prettifier',
    description: 'Instantly format messy SQL queries into clean, readable code. Supports multiple SQL dialects.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/sql-formatter',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit SQL Formatter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to format and beautify SQL queries for better readability.",
  "featureList": ["SQL Formatting", "Multi-dialect Support (MySQL, Postgres, BigQuery)", "Syntax Highlighting"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
         <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500 animate-gradient-text tracking-tight">
          SQL Formatter
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Beautify your SQL queries instantly. Supports Standard SQL, PostgreSQL, MySQL, and more.
        </p>
      </div>

      <SqlFormatter />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>About SQL Formatting</h2>
        <p>
          Writing complex SQL queries often results in messy, hard-to-read code. 
          A SQL formatter helps by organizing your queries with proper indentation, line breaks, and capitalization. 
          This makes it easier to debug, understand, and share your database logic.
        </p>
      </div>
    </div>
  );
}
