const express = require("express");
const router = express.Router();
const { googleLogin, getMe } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/google", googleLogin);
router.get("/me", authenticate, getMe);

module.exports = router;
