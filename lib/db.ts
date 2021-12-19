import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}
const connection = { isConnected: null }; /* creating connection object*/

// /**
//  * Global is used here to maintain a cached connection across hot reloads
//  * in development. This prevents connections growing exponentially
//  * during API Route usage.
//  */
// let cached = global.mongoose;

// if (!cached) {
//   cached  = { conn: null, promise: null };
// }

const connectDB = async () => {
  // if (cached.conn) {
  //   return cached.conn;
  // }

  // if (!cached.promise) {
  //   const opts = {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     bufferCommands: false,
  //   };

  //   cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
  //     return mongoose;
  //   });
  // }
  // cached.conn = await cached.promise;
  // return cached.conn;
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return;
  }

  /* connecting to our database */
  const db = await mongoose.connect(MONGODB_URI).then((mongoose) => {
    return mongoose;
  });

  connection.isConnected = db.connections[0].readyState;
  return connection.isConnected;
};

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = null;
    }
  }
}

const db = { connectDB, disconnect };

export default db;
