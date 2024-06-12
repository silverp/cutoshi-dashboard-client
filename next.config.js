const dotenv = require('dotenv');
dotenv.config();

const nextConfig = {
  reactStrictMode: false,
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    ENV: process.env.NODE_ENV,
    PRESALE_SALE: process.env.PRESALE_SALE,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
