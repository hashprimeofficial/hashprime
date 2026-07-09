const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://hashprime256_db_user:OttMXdJe5Xfw2nvX@cluster0.epadzo5.mongodb.net/?appName=Cluster0';
const NEW_PASSWORD = 'hashprime@2026';

async function updateAdminPassword() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find the admin user
    const adminUser = await usersCollection.findOne({ role: 'admin' });

    if (!adminUser) {
      console.error('❌ No admin user found in the database.');
      process.exit(1);
    }

    console.log(`✅ Found admin user: ${adminUser.email}`);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    // Update the password
    const result = await usersCollection.updateOne(
      { _id: adminUser._id },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 1) {
      console.log(`✅ Admin password updated successfully for: ${adminUser.email}`);
      console.log(`   New password: ${NEW_PASSWORD}`);
    } else {
      console.error('❌ Failed to update password.');
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

updateAdminPassword();
