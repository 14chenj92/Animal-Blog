const express = require('express');
const multer = require('multer');
const path = require('path');
const { Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

const router = express.Router();

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Create a post
router.post('/', upload, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
      img: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Create a comment
router.post('/:id', async (req, res) => {
  try {
    const newComment = await Comment.create({
      description: req.body.description,
      user_id: req.body.post_id,
      post_id: req.body.route_id
    });
    console.log(req.body.post_id);
    res.status(200).json(newComment);
  } catch (err) {
    console.log(err);
    console.log(req.body.post_id);
    res.status(500).json(err);
  }
});

// Update post likes
router.put('/:id', async (req, res) => {
  const int = parseInt(req.body.tally);
  console.log(req.body);
  try {
    const updatePD = await Post.update(
      {
        tally: int + 1,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    res.status(200).json(updatePD);
    console.log(updatePD);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
