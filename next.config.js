/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cloud.appwrite.io', 'via.placeholder.com'],
        // remotePatterns: [{
        //         protocol: "https",
        //         hostname: "via.placeholder.com",
        //         pathname: "/**",
        //     },
        //     {
        //         protocol: "https",
        //         hostname: "cloud.appwrite.io",
        //         pathname: "/**",
        //     },
        // ],
    },
};

module.exports = nextConfig;