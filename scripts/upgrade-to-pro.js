/**
 * Direct script to upgrade user to Pro plan
 * Run with: node scripts/upgrade-to-pro.js
 * 
 * Make sure .env.local has Firebase Admin credentials
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

// Initialize Firebase Admin
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const hasAdminCredentials =
  Boolean(process.env.FIREBASE_PROJECT_ID) &&
  Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
  Boolean(privateKey);

if (!hasAdminCredentials) {
  console.error('❌ Firebase Admin credentials not found in .env.local');
  console.error('   Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const USER_EMAIL = 'shehanhashen928@gmail.com';

async function upgradeUserToPro() {
  try {
    console.log(`\n🔍 Looking for user with email: ${USER_EMAIL}`);
    
    const db = admin.firestore();
    
    // Find user by email
    const usersSnapshot = await db
      .collection('users')
      .where('email', '==', USER_EMAIL.toLowerCase())
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('❌ User not found!');
      process.exit(1);
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    console.log(`✅ Found user: ${userData.name || userData.email}`);
    console.log(`   Current plan: ${userData.plan || 'free'}`);
    console.log(`   User ID: ${userId}`);

    // Update to Pro plan
    await userDoc.ref.update({
      plan: 'pro',
      subscription: {
        status: 'active',
        renewsAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        ), // 1 year from now
        stripeId: null,
      },
    });

    console.log('\n✅ Successfully upgraded user to PRO plan!');
    console.log('   Plan: pro');
    console.log('   Status: active');
    console.log('   Renews: 1 year from now');
    console.log('\n🎉 All Pro features are now enabled!');
    console.log('\nYou can now test:');
    console.log('  ✅ Unlimited templates');
    console.log('  ✅ Unlimited A/B tests');
    console.log('  ✅ Advanced analytics');
    console.log('  ✅ Team collaboration');
    console.log('  ✅ API access');
    console.log('  ✅ White-label option');
    console.log('\n💡 Log out and log back in to see the changes in the app.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error upgrading user:', error);
    process.exit(1);
  }
}

upgradeUserToPro();
