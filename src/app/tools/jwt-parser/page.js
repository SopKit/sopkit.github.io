import JwtParser from '@/components/tools/JwtParser';

export const metadata = {
  title: 'JWT Parser & Decoder | Debug JSON Web Tokens Online',
  description: 'Decode and debug JWT (JSON Web Tokens) online. View header and payload data instantly. Client-side only processing for maximum security.',
  keywords: 'jwt decoder, jwt parser, debug jwt, json web token, jwt viewer, online jwt tool, developer security tools',
  openGraph: {
    title: 'JWT Parser & Decoder | Debug JSON Web Tokens',
    description: 'Secure client-side JWT decoder. Inspect token headers and claims without sending data to a server.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/jwt-parser',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit JWT Parser",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A secure online tool to parse and decode JSON Web Tokens (JWT) directly in your browser.",
  "featureList": ["Client-side processing", "Instant Decoding", "Header Inspection", "Payload Inspection"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-600 animate-gradient-text tracking-tight">
          JWT Parser
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Decode JSON Web Tokens instantly with our secure, client-side parser. 
          Your tokens never leave your browser.
        </p>
      </div>

      <JwtParser />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12">
        <h2>About JSON Web Tokens (JWT)</h2>
        <p>
          JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way 
          for securely transmitting information between parties as a JSON object. This information can be verified 
          and trusted because it is digitally signed.
        </p>

        <h3>Security & Privacy</h3>
         <p>
          <strong>Important:</strong> This tool operates entirely in your browser using JavaScript. 
          Your JWTs are NOT sent to any server. However, you should always be cautious when pasting 
          sensitive production tokens into any third-party website.
        </p>

        <h3>Structure of a JWT</h3>
        <ul>
            <li><strong>Header:</strong> Typically consists of two parts: the type of the token (JWT) and the signing algorithm being used (e.g., HMAC SHA256 or RSA).</li>
            <li><strong>Payload:</strong> Contains the claims. Claims are statements about an entity (typically, the user) and additional data.</li>
            <li><strong>Signature:</strong> Used to verify that the message wasn't changed along the way, and, in the case of tokens signed with a private key, it can also verify that the sender of the JWT is who it says it is.</li>
        </ul>
      </div>
    </div>
  );
}
