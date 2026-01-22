import AudioRecorder from '@/components/tools/AudioRecorder';

export const metadata = {
  title: 'Online Voice Recorder | Record Audio in Browser',
  description: 'Free online voice recorder. Record audio from your microphone and download as WebM. No installation required, secure and private.',
  keywords: 'voice recorder, audio recorder, online recording, microphone recorder, web recorder, sound recorder',
  openGraph: {
    title: 'Online Voice Recorder | Free Audio Tool',
    description: 'Record voice notes and audio directly in your browser. Simple, fast, and free.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/audio-recorder',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Voice Recorder",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "An online tool to record audio from the microphone directly in the browser.",
  "featureList": ["Microphone Recording", "WebM Download", "Visual Timer"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 animate-gradient-text tracking-tight">
          Online Voice Recorder
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Simple, fast, and free voice recorder. 
          Recordings are processed locally and never uploaded.
        </p>
      </div>

      <AudioRecorder />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>About Audio Recording</h2>
        <p>
          This tool uses the Web Audio API and MediaStream Recording API to capture audio directly from your microphone. 
          The resulting file is in WebM format, which is optimized for web usage.
        </p>
      </div>
    </div>
  );
}
