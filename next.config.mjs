/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        optimizeCss: true,
    },
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://sopkit.github.io' : '',
};

export default nextConfig;
