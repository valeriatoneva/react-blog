import React, { useState } from 'react';
import '../css/CreatePost.css'; 

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setMessage({ type: '', text: '' });
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
  
      fetch('http://localhost:3001/posts', {
        method: 'POST',
        body: formData, // send the form data as the request body
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.error || 'Server error');
          });
        }
        return response.json();
      })
      .then(data => {
        setTitle('');
        setContent('');
        setImage(null);
        setMessage({ type: 'success', text: 'Post created successfully!' });
      })
      .catch((error) => {
        // Handle error
        setMessage({ type: 'error', text: error.message });
      });
    };
  
    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };
  
    return (
      <div>
        <h1>Create Post</h1>
        {message.text && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            required
          />
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/jpg"
          />
          <button type="submit">Create</button>
        </form>
      </div>
    );
  }
  
  export default CreatePost;