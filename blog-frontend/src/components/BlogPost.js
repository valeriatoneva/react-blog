import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/BlogPost.css'; 


function BlogPost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3001/posts/${id}`)
      .then(response => response.json())
      .then(data => setPost(data));
  }, [id]);

  if (!post) return <div>Loading...</div>;

  // formatting the date
  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(' ', 'T'));
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString(undefined, options);
  };

  return (
    <div className="blog-post">
      <h1>{post.title}</h1>
      <p className="date">Published on {formatDate(post.createdAt)}</p>
      {post.img && <img src={`http://localhost:3001/img/${post.img}`} alt={post.title} />}
      <div className="content">
        {post.content}
      </div>
    </div>
  );
}

export default BlogPost;

