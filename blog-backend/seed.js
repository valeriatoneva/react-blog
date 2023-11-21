
// run this script with node seed.js wehnever you want to populate the db 
require('dotenv').config();
const db = require('./database.js');

const mock = [
  { title: 'The Hidden Gems of Urban Architecture', content: 'Explore lesser-known architectural marvels in various cities. Each post could highlight a different building or structure, discussing its history, design, and cultural significance.', img: 'architecture-blog.jpg' },
  { title: 'Tech Trends That Are Changing Our Lives', content: 'Discuss the latest technological advancements and how they are impacting everyday life. Topics could range from AI and machine learning to the newest gadgets and apps.', img: 'tech-blog.jpg' },
  { title: 'Culinary Adventures: Around the World in 80 Dishes', content: 'A journey through international cuisines, featuring recipes, cooking techniques, and cultural stories behind famous dishes from different countries.', img: 'culinary-blog.jpg' },
];

const insertPost = (post) => {
  db.run('INSERT INTO posts (title, content, img) VALUES (?, ?, ?)', 
         [post.title, post.content, post.img], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Post '${post.title}' was added.`);
    }
  });
};

// insert each post into the db
mock.forEach(insertPost);

// this code won't overwrite any existing data, it will just add to it (for testing purposes)