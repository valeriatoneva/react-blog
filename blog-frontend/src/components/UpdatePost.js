import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: '', content: '', img: '' });
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:3001/posts/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPost(data);
                if (data.img) {
                    setImage(data.img);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);


    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('content', post.content);
      if (image instanceof File) {
          formData.append('image', image);
      }

      try {
          const response = await fetch(`http://localhost:3001/posts/${id}`, {
              method: 'PUT',
              body: formData, 
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Server error');
          }

          navigate('/');
      } catch (err) {
          setError(err.message);
      }
  };

  const handleImageChange = (e) => {
      setImage(e.target.files[0]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="update-post-container">
        <h1>Edit Post</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-form">
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={post.content}
                    onChange={(e) => setPost({ ...post, content: e.target.value })}
                />
            </div>
            <div className="form-group file-input">
                <label htmlFor="image"></label>
                <input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/jpg"
                />
                {post.img && !image && <span className="file-name">{post.img}</span>}
            </div>
            <button type="submit" className="submit-button">Update Post</button>
        </form>
    </div>
);
}

export default UpdatePost;
