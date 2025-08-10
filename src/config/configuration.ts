export default () => ({
  // Server configuration
  server: {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
  },

  // Database configuration
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DATABASE,
  },

  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME,
  },
});
