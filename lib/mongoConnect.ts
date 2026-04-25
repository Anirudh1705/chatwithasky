import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot';

let cached = global as any;

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

export async function connectDb() {
  if (cached.mongoose.conn) {
    return cached.mongoose.conn;
  }

  if (!cached.mongoose.promise) {
    cached.mongoose.promise = mongoose.connect(mongoUri).then((mongoose) => {
      return mongoose;
    });
  }

  cached.mongoose.conn = await cached.mongoose.promise;
  return cached.mongoose.conn;
}
