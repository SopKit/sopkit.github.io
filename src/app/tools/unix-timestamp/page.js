import UnixTimestamp from '@/components/tools/UnixTimestamp';

export const metadata = {
  title: 'Unix Timestamp Converter | Epoch Time Tool',
  description: 'Convert Unix timestamps to human-readable dates and vice versa. View current epoch time live. Essential tool for developers.',
  keywords: 'unix timestamp, epoch converter, unix time, epoch time, timestamp converter, date to timestamp, developer tools',
  openGraph: {
    title: 'Unix Timestamp Converter | Live Epoch Tool',
    description: 'Convert between Epoch timestamps and human-readable dates immediately.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/unix-timestamp',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Unix Timestamp Converter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to convert Unix timestamps (Epoch time) to human-readable dates and back.",
  "featureList": ["Live Epoch Clock", "Bidirectional Conversion", "Timezone Support"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-lime-600 animate-gradient-text tracking-tight">
          Unix Timestamp Converter
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Convert timestamps to readable dates and vice-versa. 
          View the current Unix Epoch time live.
        </p>
      </div>

      <UnixTimestamp />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>What is Unix Time?</h2>
        <p>
          Unix time (also known as Epoch time) is a system for describing a point in time. 
          It is the number of seconds that have elapsed since the Unix epoch, excluding leap seconds. 
          The Unix epoch is 00:00:00 UTC on 1 January 1970.
        </p>
      </div>
    </div>
  );
}
