// Migration script to drop unique index on ownerId in hotels collection
// Run this once: node src/scripts/drop-hotel-ownerid-index.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

async function dropIndex() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("hotels");

    // List all indexes
    const indexes = await collection.indexes();
    console.log("📋 Current indexes:", indexes.map(idx => idx.name));

    // Drop the unique index on ownerId if it exists
    try {
      await collection.dropIndex("ownerId_1");
      console.log("✅ Successfully dropped ownerId_1 unique index");
    } catch (error) {
      if (error.codeName === "IndexNotFound") {
        console.log("ℹ️  Index ownerId_1 does not exist (already dropped)");
      } else {
        throw error;
      }
    }

    // Verify indexes after dropping
    const newIndexes = await collection.indexes();
    console.log("📋 Indexes after drop:", newIndexes.map(idx => idx.name));

    // Verify no unique index on ownerId
    const ownerIdIndex = newIndexes.find(idx => 
      idx.key && idx.key.ownerId && idx.unique === true
    );
    if (ownerIdIndex) {
      console.error("❌ ERROR: Unique index on ownerId still exists!");
      process.exit(1);
    } else {
      console.log("✅ Verified: No unique index on ownerId");
    }

    console.log("✅ Migration complete! Multiple hotels per user are now allowed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

dropIndex();

