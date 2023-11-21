const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(process.env.DATABASE_PATH, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt DATE DEFAULT CURRENT_TIMESTAMP,
        img VARCHAR(255)
      )`;
    db.run(createTableQuery, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Table created or it exists.');
      }
    });
  }
});

module.exports = db;
