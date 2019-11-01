const express = require("express");
const router = express.Router();
//@router Get api/auth
//@desc auth route
//@access Public
router.get("/", (req, res) => {
  res.send("auth route");
});

module.exports = router;
