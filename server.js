const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profilePicture: { type: String, default: null }, 
});

const User = mongoose.model("User", userSchema);

dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/favicon.ico', (req, res) => {
    res.status(204);
});

app.get("/register", (req, res) => {
  res.render("register", { errorMessage: null });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        errorMessage: "This email is already registered.",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.render("register", {
        errorMessage: "This username is already taken.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.redirect("/login"); 
  } catch (err) {
    console.error(err);
    res.render("register", {
      errorMessage: "An error occurred while registering. Please try again.",
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login", { errorMessage: null });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", { errorMessage: "Unregistered email" });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.render("login", {
        errorMessage: "Your account is locked. Please try again later.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
      req.session.userId = user._id;
      return res.redirect("/dashboard");
    }

    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = Date.now() + 30 * 60 * 1000;
      await user.save();
      return res.render("login", {
        errorMessage: "Your account is locked due to too many failed attempts.",
      });
    }

    await user.save();
    return res.render("login", { errorMessage: "Incorrect password" });
  } catch (err) {
    console.error(err);
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.post("/profile", upload.single("profilePicture"), async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const updateData = {
      username: req.body.username,
      email: req.body.email,
    };
    if (req.file) updateData.profilePicture = "/uploads/" + req.file.filename;
    await User.findByIdAndUpdate(req.session.userId, updateData);
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.redirect("/profile");
  }
});

app.get("/profile", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login"); 
  }

  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect("/login"); 
    }

    res.render("profile", { user });
  } catch (err) {
    console.error(err);
    res.redirect("/login");
  }
});

app.get("/editprofile", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login"); 
  }

  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect("/login"); 
    }

    res.render("editprofile", { user });
  } catch (err) {
    console.error(err);
    res.redirect("/login");
  }
});

app.post("/editprofile", upload.single("profilePicture"), async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const updateData = {
      username: req.body.username,
      email: req.body.email,
    };

    if (req.file) {
      updateData.profilePicture = "/uploads/" + req.file.filename;
    }

    await User.findByIdAndUpdate(req.session.userId, updateData);

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.redirect("/editprofile");
  }
});

app.get("/dashboard", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const userBlogs = await Blog.find({ userId: req.session.userId });

    const otherBlogs = await Blog.find({ userId: { $ne: req.session.userId } });

    res.render("dashboard", { userBlogs, otherBlogs, user: req.session });
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard");
  }
});

app.get("/editblog/:id", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const blog = await Blog.findById(req.params.id);

    if (blog.userId.toString() !== req.session.userId.toString()) {
      return res.redirect("/dashboard"); 
    }

    res.render("editblog", { blog });
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard");
  }
});

app.post("/editblog/:id", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  const { title, content } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    res.redirect("/dashboard"); 
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard");
  }
});

app.get("/deleteblog/:id", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const blog = await Blog.findById(req.params.id);

    if (blog.userId.toString() !== req.session.userId.toString()) {
      return res.redirect("/dashboard");
    }

    await Blog.findByIdAndDelete(req.params.id); 
    res.redirect("/dashboard"); 
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard");
  }
});

const crypto = require("crypto");

app.get("/forgot-password", (req, res) => {
  res.render("forgot-password"); 
});

require("dotenv").config();
const mailjet = require("node-mailjet");
const mailjetClient = mailjet.apiConnect(
  process.env.MAILJET_API,
  process.env.MAILJET_SECRET
);

async function sendEmail(recipient, subject, textContent, htmlContent) {
  try {
    const result = await mailjetClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "hardwarerump04@gmail.com", 
              Name: "Nursultan Nurgaliyev", 
            },
            To: [
              {
                Email: recipient, 
                Name: "You are a customer of our sevice", 
              },
            ],
            Subject: subject, 
            TextPart: textContent, 
            HTMLPart: htmlContent, 
          },
        ],
      });

    console.log("Email sent successfully:", result.body, recipient);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err; 
  }
}

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found with this email.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const subject = "Password Reset Request";
    const textContent = `Click the following link to reset your password: ${resetLink}`;
    const htmlContent = `<h3>Click the following link to reset your password: <a href="${resetLink}">Reset Password</a></h3>`;

    await sendEmail(email, subject, textContent, htmlContent);

    res.send("Password reset link sent to your email.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again.");
  }
});

app.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    res.render("reset-password", { token }); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpires = undefined; 
    await user.save();

    res.send("Your password has been reset successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again.");
  }
});

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

app.post("/addblog", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login"); 
  }

  const { title, content } = req.body;
  const userId = req.session.userId; 

  try {
    const user = await User.findById(userId);

    const newBlog = new Blog({
      userId, 
      username: user.username, 
      title, 
      content, 
    });

    await newBlog.save(); 

    res.redirect("/dashboard"); 
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard"); 
  }
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username !== process.env.ADMIN_USERNAME) {
      return res.render("admin-login", {
        errorMessage: "Unregistered username",
      });
    }

    const isMatch = process.env.ADMIN_PASSWORD;

    if (!isMatch) {
      return res.render("admin-login", { errorMessage: "Incorrect password" });
    }

    req.session.adminId = "admin"; 
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.render("admin-login", {
      errorMessage: "Something went wrong, please try again",
    });
  }
});

app.get("/admin/dashboard", async (req, res) => {
  if (!req.session.adminId) {
    return res.redirect("/admin/login"); 
  }

  try {
    const blogs = await Blog.find();

    res.render("admin-dashboard", { blogs });
  } catch (err) {
    console.error(err);
    res.render("admin-dashboard", { errorMessage: "Could not fetch blogs." });
  }
});

app.get("/admin/login", (req, res) => {
  res.render("admin-login", { errorMessage: null }); 
});

app.get("/admin", async (req, res) => {
  if (!req.session.adminId) {
    return res.redirect("/admin/login"); 
  }

  try {
    const blogs = await Blog.find(); 
    res.render("admin-dashboard", { blogs, errorMessage: null });
  } catch (err) {
    console.error(err);
    res.render("admin-dashboard", { errorMessage: "Failed to load blogs" });
  }
});

app.post("/admin/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.session.adminId) {
      return res.redirect("/admin/login");
    }

    await Blog.findByIdAndDelete(id);

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/dashboard");
  }
});

app.get("/admin/logout", (req, res) => {
  req.session.isAdmin = false;
  res.redirect("/admin/login"); 
});

app.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/admin/dashboard");
    }
    res.redirect("/admin/login"); 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
