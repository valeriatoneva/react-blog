require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const db = require('./database.js');
const fs = require('fs');

const app = express();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'img/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// middleware
app.use(cors()); // CORS for all routes
app.use(bodyParser.json()); // JSON request bodies
app.use('/img', express.static('img'));

// CRUD

app.post('/posts',
  upload.single('image'), // 'image' is the name of the field in the form
  body('title').isLength({ min: 1 }).trim().escape(),
  body('content').isLength({ min: 1 }).trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const img = req.file ? req.file.filename : null; // Only store the filename

    const sql = `INSERT INTO posts (title, content, img) VALUES (?, ?, ?)`;
    db.run(sql, [title, content, img], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, img: img });
    });
});

// read all posts
app.get('/posts', (req, res) => {
    const sql = `SELECT * FROM posts`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// read a single post by ID
app.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM posts WHERE id = ?`;
    db.get(sql, id, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ error: "Post not found" });
        }
    });
});

// update a post
app.put('/posts/:id', 
  upload.single('image'), // Handle image upload
  body('title').optional().isLength({ min: 1 }).trim().escape(),
  body('content').optional().isLength({ min: 1 }).trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const id = req.params.id;
    const img = req.file ? req.file.filename : null; // Get the new filename

    // Update logic with file replacement
    db.get(`SELECT img FROM posts WHERE id = ?`, id, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const sql = `UPDATE posts SET title = ?, content = ?, img = COALESCE(?, img) WHERE id = ?`;
      db.run(sql, [title, content, img, id], function(updateErr) {
        if (updateErr) {
          return res.status(500).json({ error: updateErr.message });
        }

        // Delete the old image if a new one was uploaded
        if (img && row.img) {
          fs.unlink(`img/${row.img}`, unlinkErr => {
            if (unlinkErr) {
              console.error(unlinkErr);
            }
            console.log('Successfully deleted old image.');
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: `Row(s) updated: ${this.changes}`, img: img });
      });
    });
});

// delete a post
app.delete('/posts/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM posts WHERE id = ?`;
    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: `Row(s) deleted: ${this.changes}` });
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
