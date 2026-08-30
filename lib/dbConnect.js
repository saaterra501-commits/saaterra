

import dns from 'dns';
import mongoose from 'mongoose';

// Fix for Node.js ETIMEOUT on SRV DNS resolution (common with MongoDB Atlas on Indian ISPs & Windows)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Ignore if custom dns servers cannot be set in some environments
}

const MONGOOSE_OPTS = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 20,
  family: 4, // Force IPv4 to avoid IPv6 resolution delays
};

const globalWithMongoose = globalThis;

if (!globalWithMongoose._mongooseCache) {
  globalWithMongoose._mongooseCache = { conn: null, promise: null };
}

const cache = globalWithMongoose._mongooseCache;

async function dbConnect() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[dbConnect] Warning: MONGODB_URI environment variable is not defined.');
    return null;
  }
  
  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  if (cache.conn && mongoose.connection.readyState !== 1) {
    cache.conn = null;
    cache.promise = null;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, MONGOOSE_OPTS)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    cache.conn = null;
    console.error('[dbConnect Error]:', error.message);
    throw error;
  }

  return cache.conn;
}

export default dbConnect;
