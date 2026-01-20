// server/src/controllers/authController.js (Complete & Fixed)

const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
// Replace googleLogin function completely:
const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential required" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // UPSERT: Find OR create (no duplicate errors!)
    const user = await User.findOneAndUpdate(
      { googleId },
      {
        googleId,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        avatar: picture,
        role: "admin",
      },
      {
        upsert: true, // Create if not exists
        new: true, // Return updated doc
        runValidators: true, // Validate on upsert
      },
    );

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar,
      role: req.user.role,
    },
  });
};

module.exports = { googleLogin, getMe };
