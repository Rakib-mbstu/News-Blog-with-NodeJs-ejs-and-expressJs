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
    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (e) {
    console.log(e);
  }
});

//create new post

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "NodeJs bloging site",
    };
    res.render("admin/add-post", { locals, layout: adminLayout });
  } catch (e) {
    console.log(e);
  }
});

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await Post.create(newPost);
    } catch (error) {
      console.log(error);
    }
    res.redirect("/dashboard");
  } catch (e) {
    console.log(e);
  }
});
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "NodeJs bloging site",
    };
    const data = await Post.findById(req.params.id);
    res.render("admin/edit-post", { locals, data, layout: adminLayout });
  } catch (e) {
    console.log(e);
  }
});
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect("/dashboard");
  } catch (e) {
    console.log(e);
  }
});
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (e) {
    console.log(e);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
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
