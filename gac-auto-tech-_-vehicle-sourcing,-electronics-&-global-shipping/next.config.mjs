/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The electronics catalogue was retired; send old shared links to the vehicle listings instead of a 404.
  async redirects() {
    return [
      { source: '/products', destination: '/vehicles', permanent: true },
      { source: '/products/:id', destination: '/vehicles', permanent: true },
    ];
  },
};

export default nextConfig;
