const mongoose = require("mongoose");

async function connectDB(retries = 3) {
  const url = process.env.MONGO_DB_URL;

  if (!url) {
    console.error("❌ MONGO_DB_URL is not set in .env file");
    console.error("   Server will start but database operations will fail.");
    return;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ Connected to MongoDB");
      return;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed`);
      if (attempt === retries) {
        console.error("   Could not connect to MongoDB after all retries.");
        console.error("   Common fixes:");
        console.error("   1. Whitelist your IP in MongoDB Atlas → Network Access → Add Current IP");
        console.error("   2. Or use Allow Access from Anywhere (0.0.0.0/0)");
        console.error("   3. Check your MONGO_DB_URL in .env is correct");
        console.error("   Server will continue running but DB operations will fail.");
      } else {
        console.log(`   Retrying in 2 seconds...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
}

const apiSchema = new mongoose.Schema(
  {
    apiId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    payTo: { type: String, required: true },
    amount: { type: Number, required: true },
    endpoint: { type: String, required: true },
  },
  { timestamps: true }
);

const Api = mongoose.model("Api", apiSchema);

module.exports = { connectDB, Api };
