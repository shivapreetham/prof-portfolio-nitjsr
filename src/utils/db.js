import mongoose from 'mongoose';

const MONGODB_URI="mongodb+srv://2005shadowme:S5quug2t2WfmiabD@shatterbox.qksgz.mongodb.net/KKsir?retryWrites=true&w=majority"
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is missing in .env file');
}
let cached = global._mongoose || { conn: null, promise: null };
async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('MongoDB Connected');
      return mongoose;
    }).catch((err) => {
      console.error(' MongoDB Connection Error:', err);
      process.exit(1);
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

global._mongoose = cached;

export default dbConnect;
