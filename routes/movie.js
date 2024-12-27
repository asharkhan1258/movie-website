const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Movie = require('../models/movie');
const auth = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, publishingYear } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'movies',
    });

    const movie = new Movie({
      title,
      publishingYear,
      imageUrl: result.secure_url,
      userId: req.userId
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments({ userId: req.userId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      movies,
      currentPage: page,
      totalPages,
      totalMovies: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id, userId: req.userId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, publishingYear } = req.body;
    const movieId = req.params.id;

    const movie = await Movie.findOne({ _id: movieId, userId: req.userId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.title = title;
    movie.publishingYear = publishingYear;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'movies',
      });
      movie.imageUrl = result.secure_url;
    }

    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
