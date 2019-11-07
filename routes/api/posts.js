const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
//@router Get api/posts
//@desc Create a post
//@access private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//@router Get api/posts
//@desc get all post
//@access private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@router Get api/posts/:post_id
//@desc get  post by id
//@access private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select("-password");
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@router Delete api/posts/:post_id
//@desc Delete  a post by id
//@access private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authiorized" });
    }
    await post.remove();
    res.json({ msg: "post removed" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
//@router Put api/posts/like/:id
//@desc update a post like by id
//@access private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const likedpost = post.likes.filter(
      like => like.user.toString() === req.user.id
    );
    if (likedpost.length > 0) {
      return res.status(400).json({ msg: "post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(erroe.message);
    return res.status(500).send("Server Error");
  }
});
//@router Put api/posts/unlike/:id
//@desc update a post unlike by id
//@access private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const likedpost = post.likes.filter(
      like => like.user.toString() === req.user.id
    );
    if (likedpost.length === 0) {
      return res.status(400).json({ msg: "post has not yet been liked" });
    }
    const removeindex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeindex, 1);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});
module.exports = router;
