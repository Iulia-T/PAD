const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Define routes for each microservice
app.use('/products', createProxyMiddleware({ target: 'http://localhost:5001' }));
app.use('/orders', createProxyMiddleware({ target: 'http://localhost:5002' }));

const port = 3000;
app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
