// const mongoose = require('mongoose');
// const argon2 = require('argon2');
// const User = require('../Models/User'); // Assuming you have a User model defined
// const uri = "mongodb+srv://MuhammadSajid:soft@cluster0.ga04rak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// // Connect to MongoDB
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Define admin user details
// const adminUserData = {
//   name: 'Admin',
//   email: 'admin@gmail.com',
//   password: 'adminpassword',
//   isAdmin: true,
// };

// // Hash the admin user's password using argon2
// const createAdminUser = async () => {
//   try {
//     // Hash the password
//     const hashedPassword = await argon2.hash(adminUserData.password);
//     // Replace the plain-text password with the hashed password
//     adminUserData.password = hashedPassword;

//     // Create an admin user instance
//     const adminUser = new User(adminUserData);

//     // Save the admin user to the database
//     await adminUser.save();

//     console.log('Admin user created successfully');
//   } catch (error) {
//     console.error('Error creating admin user:', error);
//   } finally {
//     mongoose.connection.close(); // Close the connection
//   }
// };

// // Call the function to create the admin user
// createAdminUser();



























// const mongoose = require('mongoose');
// const argon2 = require('argon2');
// const User = require('./Models/User');
// const dotenv = require('dotenv');

// dotenv.config();

// const createAdmin = async () => {
//   const adminEmail = process.env.ADMIN_EMAIL;
//   const adminPassword = process.env.ADMIN_PASSWORD;

//   if (!adminEmail || !adminPassword) {
//     console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your environment variables.');
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const existingAdmin = await User.findOne({ email: adminEmail });

//     if (existingAdmin) {
//       console.log('Admin user already exists.');
//       return;
//     }

//     const passwordHash = await argon2.hash(adminPassword);

//     const admin = new User({
//       name: 'Admin',
//       email: adminEmail,
//       password: passwordHash,
//       isAdmin: true,
//     });

//     await admin.save();
//     console.log('Admin user created successfully.');
//   } catch (error) {
//     console.error('Error creating admin user:', error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// createAdmin();





















const mongoose = require('mongoose');
const argon2 = require('argon2');
const User = require('./Models/User');
const jwt = require('jsonwebtoken'); // Import jwt module
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your environment variables.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    const passwordHash = await argon2.hash(adminPassword);

    const admin = new User({
      name: 'Admin',
      email: adminEmail,
      password: passwordHash,
      isAdmin: true,
    });

    await admin.save();

    // Create token payload with isAdmin property set to true
    const payload = {
      id: admin._id, // Assuming _id is the ID of the admin user
      isAdmin: true,
    };

    // Generate JWT token with payload
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', // Example expiration time
    });

    console.log('Admin user created successfully.');
    console.log('Admin Token:', token); // Log the generated token
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
