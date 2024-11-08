import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/@syncfusion/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#0a0a0a',
          alternativedark: '#27272a',
        },
        foreground: {
          light: '#171717',
          dark: '#ededed',
        },
        hover: {
          light: 'rgba(9, 9, 11, 0.05)',
          dark: 'rgb(37, 99, 235)',
        },
        spanColor: {
          light: '#333333',
          dark: '#dddddd',
        },
        read: {
          light: '#f3f4f6',
          dark: '#3f3f46',
        },
        unread: {
          light: '#ffffff',
          dark: '#ffffff',
        },
      },
    },
  },
  plugins: [
    flowbitePlugin,
  ],
};
export default config;
