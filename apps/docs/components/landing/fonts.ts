import { Inter, Paprika, Plus_Jakarta_Sans } from 'next/font/google';

// The landing page uses the Ladom website's fonts (Ladom Agency Website in Figma); the library
// and the docs use Hanken Grotesk from the tokens.
export const jakarta = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], weight: ['800'], variable: '--font-jakarta', display: 'swap' });
export const paprika = Paprika({ subsets: ['latin', 'latin-ext'], weight: '400', variable: '--font-paprika', display: 'swap' });
export const inter = Inter({ subsets: ['latin', 'latin-ext'], axes: ['opsz'], variable: '--font-inter', display: 'swap' });
