import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListOfPosts from './components/ListOfPosts'; 
import BlogPost from './components/BlogPost'; 
import CreatePost from './components/CreatePost'; 
import UpdatePost from './components/UpdatePost';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ListOfPosts />} />
          <Route path="/post/:id" element={<BlogPost />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<UpdatePost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
