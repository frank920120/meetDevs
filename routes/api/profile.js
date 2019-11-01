const express = require("express");
const router = express.Router();
//@router Get api/profiles
//@desc Test route
//@access Public
router.get("/", (req, res) => {
  res.send("profile route");
});

module.exports = router;
