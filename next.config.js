/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "asset.brandfetch.io",
      "upload.wikimedia.org",
      "assets.materialup.com",
      "media.npr.org",
      "media.wired.com",
      "fleetpeople.es",
      "ichef.bbci.co.uk",
      "firebasestorage.googleapis.com",
    ],
  },
};

module.exports = nextConfig;
