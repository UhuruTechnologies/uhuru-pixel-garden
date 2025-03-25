module.exports = {
  async headers() {
    return [
      {
        source: '/js/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
    ];
  },
}; 