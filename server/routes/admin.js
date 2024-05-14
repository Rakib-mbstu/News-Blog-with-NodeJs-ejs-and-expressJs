const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;

//admin login

const adminLayout = "../views/layouts/admin";

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "NodeJs bloging site",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//check is logged in

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//login prompt

router.post("/sign", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid" });
    }
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//dashboard rendered

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "NodeJs bloging site",
    };
    const data = await Post.find();
    res.render("admin/dashboard", { locals, data });
  } catch (e) {
    console.log(e);
  }
});

// router.post("/register", async (req, res) => {
//   try {
//     const { userName, password } = req.body;
//     console.log(password);
//     const hashPassword = await bcrypt.hash(password, 10);
//     try {
//       const user = await User.create({
//         userName: userName,
//         password: hashPassword,
//       });
//       console.log(user);
//       res.status(201).json({ message: "user created" });
//     } catch (error) {
//       console.log(error);
//       if (error == 11000) {
//         res.status(409).json({ message: "Already in Use" });
//       }
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
