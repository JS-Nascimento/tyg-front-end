// next.config.mjs
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['apexcharts',
    '@syncfusion/ej2',
    '@syncfusion/ej2-react-base',
    '@syncfusion/ej2-react-buttons',
    '@syncfusion/ej2-react-calendars',
    '@syncfusion/ej2-react-charts',
    '@syncfusion/ej2-react-diagrams',
    '@syncfusion/ej2-react-dropdowns',
    '@syncfusion/ej2-react-grids',
    '@syncfusion/ej2-react-inputs',
    '@syncfusion/ej2-react-layouts',
    '@syncfusion/ej2-react-lists',
    '@syncfusion/ej2-react-maps',
    '@syncfusion/ej2-react-navigations',
    '@syncfusion/ej2-react-notifications',
    '@syncfusion/ej2-react-popups',
    '@syncfusion/ej2-react-progressbar',
    '@syncfusion/ej2-react-splitbuttons',
    ],
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
