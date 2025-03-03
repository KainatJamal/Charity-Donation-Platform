const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // proxy all requests starting with '/api'
    createProxyMiddleware({
      target: 'https://api.globalgiving.org', // Target API server
      changeOrigin: true,
      secure: false, // for SSL requests
    })
  );
};
