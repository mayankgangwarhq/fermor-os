const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envText = fs.readFileSync('backend/.env', 'utf-8');
const lines = envText.split('\n');
const env = {};
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx !== -1) {
    env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
  }
}

const uri = env.MONGODB_URI;

async function testMongo() {
  console.log('Testing mongoose.connect without custom dns servers...');
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('SUCCESS! Connected to host:', conn.connection.host, 'db:', conn.connection.name);
    await mongoose.disconnect();
  } catch (err) {
    console.log('Test 1 Error:', err.name, err.message);
    if (err.reason) {
      console.log('Reason details:', err.reason);
    }
  }
}

testMongo();
