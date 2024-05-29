const User = require('../Models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, Email, and Password are required." });
    }

    const passwordHash = await argon2.hash(password);

    const userDetails = await User.create({
      name,
      email,
      password: passwordHash,
    });

    // Create token payload
    const payload = {
      id: userDetails._id,
      isAdmin: userDetails.isAdmin, // Assuming you have an isAdmin property
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ user: userDetails, token });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ error: "An error occurred while creating the user." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required." });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ error: "Authentication failed. User not found." });
    }

    const isPasswordValid = await argon2.verify(foundUser.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Authentication failed. Invalid password." });
    }

    // Create token payload
    const payload = {
      id: foundUser._id,
      isAdmin: foundUser.isAdmin, // Assuming you have an isAdmin property
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.header('Authorization', token).json({ message: "Login successful", data: token, email: foundUser.email });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { register, login };
