const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val.trim();
      }
    });
  }
} catch (e) {
  console.warn('Could not read .env.local:', e.message);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

async function cleanAllReviews() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Clear reviews from deals collection
    const dealsResult = await mongoose.connection.collection('deals').updateMany(
      {},
      {
        $set: {
          reviews: [],
          reviewsCount: 0,
          rating: 5.0,
          tacoRating: 5.0,
          'tacoBreakdown.taco5': 0,
          'tacoBreakdown.taco4': 0,
          'tacoBreakdown.taco3': 0,
          'tacoBreakdown.taco2': 0,
          'tacoBreakdown.taco1': 0,
        }
      }
    );
    console.log(`✅ Cleared reviews on ${dealsResult.modifiedCount} deals in 'deals' collection.`);

    // 2. Clear reviews from ltddeals collection if exists
    try {
      const ltdResult = await mongoose.connection.collection('ltddeals').updateMany(
        {},
        {
          $set: {
            reviews: [],
            reviewsCount: 0,
            rating: 5.0,
          }
        }
      );
      console.log(`✅ Cleared reviews on ${ltdResult.modifiedCount} deals in 'ltddeals' collection.`);
    } catch (e) {
      // ignore
    }

    // 3. Clear review records
    try {
      const reviewsDeleteResult = await mongoose.connection.collection('reviews').deleteMany({});
      console.log(`✅ Deleted ${reviewsDeleteResult.deletedCount} records from 'reviews' collection.`);
    } catch (e) {
      // ignore
    }

    // 4. Reset software review counts
    try {
      await mongoose.connection.collection('softwares').updateMany(
        {},
        {
          $set: {
            totalReviews: 0,
            averageRating: 5.0,
          }
        }
      );
      console.log(`✅ Reset software review counts.`);
    } catch (e) {
      // ignore
    }

    console.log('🎉 All dummy reviews have been successfully removed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning reviews:', err);
    process.exit(1);
  }
}

cleanAllReviews();
