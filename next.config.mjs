// next.config.mjs
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['apexcharts'],
    reactStrictMode: true,
    images: {
        domains: [ 'flagcdn.com','restcountries.com'],

    },
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve('./src');
        return config;
    },
};

export default nextConfig;
