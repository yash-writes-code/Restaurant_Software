// /config/appConfig.js
require('dotenv').config(); // Load environment variables from .env

const config = {
  port: process.env.PORT || 3000,       // Application port
  environment: process.env.NODE_ENV || 'development',  // Environment (development, production)

  // // Database configuration
  database: {
    url: process.env.DATABASE_URL,
          // Prisma or general database connection URL
  },

  // JWT and session settings
  jwt: {
    secret: process.env.JWT_SECRET,     // Secret key for signing JWTs
    expiresIn: '1h',                    // Token expiration time (adjust as needed)
  },

  // API rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000,           // 15 minutes
    maxRequests: 100,                   // Limit each IP to 100 requests per windowMs
  },

  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || '*',    // Allowed origins (e.g., frontend URL)
    methods: 'GET,POST,PUT,DELETE',    // Allowed methods
  },

  // Logger settings
  // logger: {
  //   level: process.env.LOG_LEVEL || 'info',    // Log level (e.g., info, debug, error)
  // },

  // Third-party API keys or credentials
  // thirdPartyAPI: {
  //   googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Google Maps API key
  //   paymentGatewayKey: process.env.PAYMENT_GATEWAY_KEY, // Payment gateway API key
  // },
};

module.exports = config;
