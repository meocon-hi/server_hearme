const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hearme_database'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});


// --- USERS ---
// Get all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM User', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Register new user
app.post('/register', (req, res) => {
  const { fullName, email, password, role } = req.body;
  db.query(
    'INSERT INTO User (fullName, email, password, role) VALUES (?, ?, ?, ?)',
    [fullName, email, password, role || 'user'],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM User WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
      res.json(results[0]);
    }
  );
});


// --- FLASHCARD SETS ---
// Get all flashcard sets
app.get('/flashcard-sets', (req, res) => {
  db.query('SELECT * FROM FlashcardSet', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create new flashcard set
app.post('/flashcard-sets', (req, res) => {
  const { name, description } = req.body;
  db.query(
    'INSERT INTO FlashcardSet (name, description) VALUES (?, ?)',
    [name, description],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

// Update flashcard set
app.put('/flashcard-sets/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.query(
    'UPDATE FlashcardSet SET name = ?, description = ? WHERE id = ?',
    [name, description, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Cập nhật bộ thẻ thành công' });
    }
  );
});

// Delete flashcard set
app.delete('/flashcard-sets/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM FlashcardSet WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Xoá bộ thẻ thành công' });
  });
});


// --- FLASHCARDS ---
// Get flashcards by set ID
app.get('/flashcards/:setId', (req, res) => {
  const { setId } = req.params;
  db.query('SELECT * FROM Flashcard WHERE setId = ?', [setId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create new flashcard
app.post('/flashcards', (req, res) => {
  const { setId, word, meaning, signVideo, exampleSentence } = req.body;
  db.query(
    'INSERT INTO Flashcard (setId, word, meaning, signVideo, exampleSentence) VALUES (?, ?, ?, ?, ?)',
    [setId, word, meaning, signVideo, exampleSentence],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

// Update flashcard
app.put('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { word, meaning, signVideo, exampleSentence } = req.body;
  db.query(
    'UPDATE Flashcard SET word = ?, meaning = ?, signVideo = ?, exampleSentence = ? WHERE id = ?',
    [word, meaning, signVideo, exampleSentence, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Cập nhật thẻ thành công' });
    }
  );
});

// Delete flashcard
app.delete('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Flashcard WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Xoá thẻ thành công' });
  });
});


// --- COURSES ---
// Get all courses
app.get('/courses', (req, res) => {
  db.query('SELECT * FROM Course', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create new course
app.post('/courses', (req, res) => {
  const { title, description } = req.body;
  db.query(
    'INSERT INTO Course (title, description) VALUES (?, ?)',
    [title, description],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

// Update course
app.put('/courses/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  db.query(
    'UPDATE Course SET title = ?, description = ? WHERE id = ?',
    [title, description, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Cập nhật khoá học thành công' });
    }
  );
});

// Delete course
app.delete('/courses/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Course WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Xoá khoá học thành công' });
  });
});


// --- LESSONS ---
// Get lessons of a course
app.get('/courses/:courseId/lessons', (req, res) => {
  const { courseId } = req.params;
  db.query('SELECT * FROM Lesson WHERE courseId = ?', [courseId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create new lesson
app.post('/lessons', (req, res) => {
  const { courseId, title, content, videoUrl } = req.body;
  db.query(
    'INSERT INTO Lesson (courseId, title, content, videoUrl) VALUES (?, ?, ?, ?)',
    [courseId, title, content, videoUrl],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

// Update lesson
app.put('/lessons/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, videoUrl } = req.body;
  db.query(
    'UPDATE Lesson SET title = ?, content = ?, videoUrl = ? WHERE id = ?',
    [title, content, videoUrl, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Cập nhật bài học thành công' });
    }
  );
});

// Delete lesson
app.delete('/lessons/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Lesson WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Xoá bài học thành công' });
  });
});


// --- START SERVER ---
app.listen(3001, () => {
  console.log('Backend API is running on http://localhost:3001');
});
