// Add this to setupProxy.js in the src directory of your React app
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy all API calls to Django backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );

  // Proxy authentication endpoints
  app.use(
    ['/login_api', '/sign', '/profile', '/findthana', '/finddistrict'],
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );

  // Proxy friend-related endpoints (matches /friends, /friends/*, /findfriend, etc)
  app.use(
    /^\/friends(\/.*)?$/,
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );

  app.use(
    /^\/findfriend(\/.*)?$/,
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );

  app.use(
    ['/add_fnf', '/update_fnf', '/delete_fnd', '/friendsugg'],
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );

  // Proxy post/blog endpoints
  app.use(
    ['/addblog', '/blog', '/comments', '/comment', '/upvote', '/posts'],
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );

  // Proxy all other endpoints as fallback
  app.use(
    '/htimeline',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );

  // Proxy WebSocket connections
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      ws: true,
      changeOrigin: true,
    })
  );
};
