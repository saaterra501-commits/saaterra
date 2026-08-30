import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://saasgrid101_db_user:2IaQ5bSNGo4cTEJc@cluster0.j1kriot.mongodb.net/saasgrid?retryWrites=true&w=majority';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Successfully connected to SaasGrid MongoDB Atlas Database!');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ MongoDB Atlas connection error:', err.message);
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}
