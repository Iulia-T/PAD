const express = require('express');
const proxy = require('express-http-proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');
const NodeCache = require('node-cache');
const { CircuitBreaker } = require('node-resiliency');

const app = express();
const PORT = 5000;

app.use('/product', proxy('http://localhost:5001')); // Assuming Product service is on port 5001
app.use('/order', proxy('http://localhost:5002'));   // Assuming Order service is on port 5002

// List of your microservices with their respective ports
const PRODUCT_SERVICE_URLS = ['http://localhost:5001', 'http://localhost:5002'];
const ORDER_SERVICE_URLS = ['http://localhost:5003', 'http://localhost:5004'];

// Cache setup
const cache = new NodeCache({ stdTTL: 60 }); // Cache TTL set to 60 seconds

// Circuit Breaker setup
const productServiceCircuitBreaker = new CircuitBreaker({
  failureThreshold: 0.5, // 50% failure threshold
  coolDownTime: 5000, // 5 seconds cooldown time
  maxRequests: 3, // Max 3 requests
  timeoutDuration: 1000, // 1-second timeout
  onStateChange: (state) => {
    console.log(`Product Service Circuit Breaker State Change: ${state}`);
  },
});

// Function to get a random URL from the given array
function getRandomUrl(urls) {
  const randomIndex = Math.floor(Math.random() * urls.length);
  return urls[randomIndex];
}

// Variable to track consecutive failures
let consecutiveFailures = 0;

// Proxy requests to the Product Service with load balancing, circuit breaker, and caching
app.all('/products/*', async (req, res) => {
  const cacheKey = req.originalUrl;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log('Cache hit for:', cacheKey);
    res.status(200).json(cachedData);
  } else {
    console.log('Cache miss for:', cacheKey);
    try {
      const response = await productServiceCircuitBreaker.invoke(async () => {
        const targetUrl = getRandomUrl(PRODUCT_SERVICE_URLS);
        return await createProxyMiddleware({ target: targetUrl, changeOrigin: true })(req, res);
      });

      if (response.status >= 500) {
        consecutiveFailures++;

        // Check if consecutive failures exceed a threshold to trigger circuit breaker
        if (consecutiveFailures >= 3) {
          productServiceCircuitBreaker.open();
          console.log('Product Service Circuit Breaker Opened due to consecutive failures.');
        }
      } else {
        // Reset consecutive failures count on a successful response
        consecutiveFailures = 0;
      }

      cache.set(cacheKey, response.data);
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
});

// Proxy requests to the Order Service with load balancing
app.all('/orders/*', createProxyMiddleware({ target: ORDER_SERVICE_URLS, changeOrigin: true }));

app.listen(PORT, () => {
  console.log(`Gateway server is running on http://localhost:${PORT}`);
});

const healthCheck = (req, res) => {
  res.status(200).send('OK');
};

app.get('/health', healthCheck);

