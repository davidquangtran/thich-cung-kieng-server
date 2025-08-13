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

  // Upstash configuration
  upstash: {
    redis: {
      restUrl: process.env.UPSTASH_REDIS_REST_URL,
      restToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
  },

  // Firebase configuration
  firebase: {
    admin: {
      type: process.env.FIREBASE_TYPE ?? '',
      projectId: process.env.FIREBASE_PROJECT_ID ?? '',
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID ?? '',
      privateKey:
        process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(
          /"/g,
          '',
        ) ?? '',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
      clientId: process.env.FIREBASE_CLIENT_ID ?? '',
      authUri: process.env.FIREBASE_AUTH_URI ?? '',
      tokenUri: process.env.FIREBASE_TOKEN_URI ?? '',
      authProviderX509CertUrl:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ?? '',
      clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL ?? '',
      universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN ?? '',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
    },
  },
});
