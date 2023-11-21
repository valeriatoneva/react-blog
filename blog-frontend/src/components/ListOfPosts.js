import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/ListOfPosts.css';

function ListOfPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/posts');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setPosts(data);
                    setLoading(false);
                } else {
                    throw new Error('Response is not JSON');
                }
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        setDeleting(id);
        setTimeout(async () => {
            try {
                const response = await fetch(`http://localhost:3001/posts/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Could not delete the post.');
                }

                const updatedPosts = posts.filter((post) => post.id !== id);
                setPosts(updatedPosts);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setDeleting(null); 
            }
        }, 300); 
    };

    return (
        <div>
            <h1>Posts 👩🏻‍💻</h1>
            <Link to="/create" className="create-post-button">Create New Post</Link>
            <div className="posts-container">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {posts.map((post) => (
                    <div key={post.id} className={`post-item ${deleting === post.id ? 'deleting' : ''}`}>
                        <div className="title-and-buttons">
                            <div className="title">
                                <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>
                            </div>
                            <div className="button-group">
                                <Link to={`/edit/${post.id}`} className="edit-button">Edit</Link>
                                <button className="delete-button" onClick={() => handleDelete(post.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListOfPosts;
