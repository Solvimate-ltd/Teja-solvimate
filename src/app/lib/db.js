import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local');
}


<<<<<<< HEAD
let cached = global.mongoose || { conn: null, promise: null };
=======
let cached = global.mongoose || { conn:
     null, promise: null };
>>>>>>> c27bcbe (Adding new Files)

async function DBConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default DBConnect;
