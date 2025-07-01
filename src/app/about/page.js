// Enhanced metadata for About page
export const metadata = {
  title: 'About SopKit - Professional Web Development Tools & Utilities',
  description: 'Learn about SopKit\'s mission to provide free, open-source web development tools. Discover our story, team, and commitment to helping developers worldwide boost their productivity.',
  keywords: 'about sopkit, web development tools, developer utilities, open source, free tools, programming utilities, development workflow',
  openGraph: {
    title: 'About SopKit - Professional Web Development Tools & Utilities',
    description: 'Learn about SopKit\'s mission to provide free, open-source web development tools for developers worldwide.',
    images: ['/og.png'],
    type: 'website',
    url: 'https://sopkit.github.io/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SopKit - Professional Web Development Tools & Utilities',
    description: 'Learn about SopKit\'s mission to provide free, open-source web development tools for developers worldwide.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: 'https://sopkit.github.io/about',
  },
};

export default function Page() {
  return (
    <>
      <div>
        <h2 id="aboutsopkit">About SopKit</h2>
        <p>
          Welcome to SopKit, your ultimate toolkit for web development. At
          SopKit, we provide a comprehensive suite of free online tools and
          utilities designed to streamline your JavaScript development workflow
          and enhance your productivity.
        </p>
        <h3 id="ourmission">Our Mission</h3>
        <p>
          Our mission is to empower developers by providing accessible,
          efficient, and user-friendly tools that simplify complex tasks.
          Whether you{"'"}re encoding data, generating random values, or converting
          markdown to HTML, SopKit has the tool you need.
        </p>
        <h3 id="whatweoffer">What We Offer</h3>
        <p>SopKit offers a wide range of utilities, including:</p>
        <ul>
          <li>
            <strong>Encoding Tools</strong>: Convert data between different
            formats such as Base64, URL encoding, and more.
          </li>
          <li>
            <strong>Hash Generators</strong>: Create various types of hashes
            including MD5, SHA1, and SHA256.
          </li>
          <li>
            <strong>Converters</strong>: Tools for converting between different
            data formats like HTML to JSX.
          </li>
          <li>
            <strong>Generators</strong>: Random number generators, gradient
            color generators, and more.
          </li>
          <li>
            <strong>Validators</strong>: Validate custom HTML elements,
            JavaScript properties, and more.
          </li>
        </ul>
        <h3 id="whychoosesopkit">Why Choose SopKit?</h3>
        <ul>
          <li>
            <strong>Ease of Use</strong>: Our tools are designed with simplicity
            in mind, making them easy to use for developers of all levels.
          </li>
          <li>
            <strong>Free and Accessible</strong>: All our tools are available
            online for free, ensuring that you have access to powerful utilities
            without any cost.
          </li>
          <li>
            <strong>Comprehensive Support</strong>: We continuously update our
            tools and add new features based on user feedback.
          </li>
        </ul>
        <h3 id="getintouch">Get in Touch</h3>
        <p>
          We value your feedback and suggestions. If you have any questions or
          ideas for new tools, please feel free to contact us through our{" "}
          <a href="https://github.com/sopkit/sopkit.github.io/issues">
            Contact Page
          </a> or by emailing us at{" "}
            <a href="mailto:sh20raj@gmail.com">
                sh20raj@gmail.com 
            </a>
          .
        </p>
        <p>
          Thank you for choosing SopKit. We look forward to helping you with
          your web development needs!
        </p>
      </div>
    </>
  );
}
