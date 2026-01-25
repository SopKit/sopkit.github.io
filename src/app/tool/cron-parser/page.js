import CronParser from '@/components/tools/CronParser';

export const metadata = {
  title: 'Cron Expression Parser | Explain Cron Schedule',
  description: 'Translate Cron expressions into plain English. Understand complex cron schedules instantly. Free online cron tool for DevOps.',
  keywords: 'cron parser, cron expression generator, explain cron, cron schedule, crontab helper, devops tools',
  openGraph: {
    title: 'Cron Expression Parser | Explain Cron Schedule',
    description: 'Understand what your Cron expression actually does in plain English.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/cron-parser',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Cron Parser",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to parse cron expressions and explain them in human-readable language.",
  "featureList": ["Cron Parsing", "Human-readable Output", "Common Examples"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 animate-gradient-text tracking-tight">
          Cron Expression Parser
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Decode complex cron schedules into plain English instantly. 
          Never guess when your job runs again.
        </p>
      </div>

      <CronParser />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>About Cron Expressions</h2>
        <p>
          Cron is a time-based job scheduler in Unix-like computer operating systems. 
          Users who set up and maintain software environments use cron to schedule jobs (commands or shell scripts) 
          to run periodically at fixed times, dates, or intervals.
        </p>
        <p>
          A standard cron expression has 5 fields: 
          <code>Minute Hour Day Month DayOfWeek</code>.
        </p>
      </div>
    </div>
  );
}
