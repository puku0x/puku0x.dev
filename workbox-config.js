module.exports = {
  globDirectory: 'dist/static',
  globPatterns: [
    '**/*.{js,LICENSE,txt,png,svg,jpg,webp,ico,html,css,json,webmanifest}',
  ],
  swDest: 'dist/static/service-worker.js',
  runtimeCaching: [
    {
      urlPattern: new RegExp(
        '^' + 'https://(avatars0|user-images).githubusercontent.com/' + '.*'
      ),
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: new RegExp(
        'https://fonts.googleapis.com|https://fonts.gstatic.com'
      ),
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
};
