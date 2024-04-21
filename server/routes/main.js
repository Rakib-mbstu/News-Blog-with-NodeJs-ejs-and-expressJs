const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
  const locals = {
    title: "Nodejs Blog",
    description: "Simple blog in nodeJs",
  };
  res.render("index", { locals });
});

module.exports = router;
