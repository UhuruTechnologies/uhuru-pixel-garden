/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  webpack: (config) => {
    // Handle THREE.js specific needs
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': require.resolve('three')
    };

    // Add support for WebGL and worker files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader']
    });

    return config;
  },
  // Allow loading of external THREE.js resources
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 