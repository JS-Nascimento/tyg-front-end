// next.config.mjs
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['apexcharts'],
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve('./src');
        return config;
    },
};

export default nextConfig;

