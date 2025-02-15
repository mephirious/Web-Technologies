const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

const User = mongoose.model("User", new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twoFASecret: { type: String, default: null },
  is2FAEnabled: { type: Boolean, default: false },
}));

app.get("/", (req, res) => res.redirect("/login"))

app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await new User({ username, password: hashedPassword }).save();
  res.redirect("/login");
});

app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send("Invalid credentials");
  }

  req.session.userId = user._id;

  if (user.is2FAEnabled) {
    return res.redirect("/verify-otp");
  }

  req.session.is2FAVerified = true;
  res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

app.get("/setup-2fa", async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect("/login");

  if (user.is2FAEnabled) return res.send("2FA already enabled!");

  const secret = speakeasy.generateSecret({ name: `MyApp (${user.username})` });
  user.twoFASecret = secret.base32;
  user.is2FAEnabled = true;
  await user.save();

  qrcode.toDataURL(secret.otpauth_url, (err, qrCode) => {
    res.render("setup-2fa", { qrCode });
  });
});

app.get("/verify-otp", (req, res) => res.render("verify-otp"));
app.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user) return res.redirect("/login");

  const verified = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token: otp,
    window: 1,
  });

  if (verified) {
    req.session.is2FAVerified = true;
    return res.redirect("/dashboard");
  }

  res.send("Invalid OTP");
});

app.get("/dashboard", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.redirect("/login");
    }

    res.render("dashboard", { is2FAEnabled: user.is2FAEnabled });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
