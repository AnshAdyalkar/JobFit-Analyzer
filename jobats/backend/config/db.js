const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

let memoryServer = null;

const likelyHasUnescapedAtInPassword = (uri) => {
  const parts = uri.split("://");
  if (parts.length < 2) return false;
  const afterScheme = parts.slice(1).join("://");
  const atCount = (afterScheme.match(/@/g) || []).length;
  return atCount > 1;
};

const connectMemoryDB = async () => {
  const { MongoMemoryServer } = require("mongodb-memory-server");

  const dbPath = path.join(__dirname, "..", ".mongo-data");
  const downloadDir = path.join(__dirname, "..", ".mongo-binaries");

  fs.mkdirSync(dbPath, { recursive: true });
  fs.mkdirSync(downloadDir, { recursive: true });

  memoryServer = await MongoMemoryServer.create({
    instance: { dbPath },
    binary: { downloadDir }
  });

  const memUri = memoryServer.getUri();
  const conn = await mongoose.connect(memUri);

  console.log(`✅ In-memory MongoDB Connected: ${conn.connection.host}`);
};

const connectDB = async () => {
  try {

    const uri = process.env.MONGODB_URI;

    // Use real MongoDB if URI exists
    if (uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))) {
      if (likelyHasUnescapedAtInPassword(uri)) {
        console.warn("⚠️ MONGODB_URI may contain an unescaped '@' in the password. URL-encode it as '%40'.");
      }

      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

      return;
    }

    console.warn("⚠️ MONGODB_URI missing, starting in-memory MongoDB");
    await connectMemoryDB();

  } catch (error) {

    const rawMessage = String(error?.message || "");
    const isAtlasWhitelist = /whitelist|not\s+whitelisted|IP that isn't whitelisted|Could not connect to any servers/i.test(rawMessage);
    if (isAtlasWhitelist) {
      console.error("❌ MongoDB Atlas blocked the connection (IP not whitelisted). Falling back to local in-memory MongoDB.");
      await mongoose.disconnect().catch(() => {});
      await connectMemoryDB();
    } else {
      console.error(`❌ MongoDB Connection Error: ${rawMessage}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
