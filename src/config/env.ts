/**
 * Application Environment Configuration
 * Centralized registry for all external API endpoints and proxies.
 * Ensures fallback values are present if environment variables are missing.
 */

export const env = {
  api: {
    bowo: process.env.NEXT_PUBLIC_BOWO_API || 'https://bowotheexplorer.vercel.app/api',
    maplewatch: process.env.NEXT_PUBLIC_MAPLEWATCH_API || 'https://maplewatch.vercel.app',
    elbowo: process.env.NEXT_PUBLIC_ELBOWO_API || 'https://elbowo.vercel.app/api',
  },
  proxy: {
    fourAnimo: process.env.NEXT_PUBLIC_PROXY_4ANIMO || 'https://cdn.4animo.xyz/api/proxy',
    elbowo: process.env.NEXT_PUBLIC_PROXY_ELBOWO || 'https://stream.animeparadise.moe/m3u8',
  }
};