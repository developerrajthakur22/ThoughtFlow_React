import React, { useContext, useState } from 'react';
import { postContext } from '../../store/UserPostContextStore';

const PostForm = () => {
    const { addNewPost } = useContext(postContext);
    const [post, setPost] = useState({ title: '', tweet: '', category: 'TECHNICAL' });

    const onSubmitHandler = (event) => {
        event.preventDefault();

        // Validate if post object has title, tweet, and category
        if (!post.title || !post.tweet || !post.category) {
            alert('Please fill in all fields.');
            return;
        }

        // If all fields are filled, add new post
        addNewPost(post);
    }

    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        // Update post state based on the input field
        setPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
    }

    return (
    <form className="post-form-container" onSubmit={onSubmitHandler} style={{backgroundColor: "white"}}>
            <div style={{ display: "flex" }}>
                <input type="text" id="title" name="title" value={post.title} placeholder="Title" className="post-input" onChange={onChangeHandler} />
                <div>
                    <label htmlFor="category" className="category-label">Category:</label>
                    <select id="category" name="category" value={post.category} className="category-select" onChange={onChangeHandler}>
                        <option value="TECHNICAL">TECHNICAL</option>
                        <option value="TRAVEL">TRAVEL</option>
                        <option value="FOOD">FOOD</option>
                        <option value="SPORTS">SPORTS</option>
                        <option value="LIFESTYLE">LIFESTYLE</option>
                        <option value="MOVIES">MOVIES</option>
                        <option value="POLITICS">POLITICS</option>
                        <option value="NEWS">NEWS</option>
                        <option value="SPACE">SPACE</option>
                        <option value="OTHER">OTHERS</option>
                    </select>
                </div>
            </div>
            <div>
                <textarea id="postContent" name="tweet" value={post.tweet} rows="3" placeholder="Write your post" className="post-textarea" onChange={onChangeHandler}></textarea>
            </div>

            <button className="btn btn-primary post-button" type="submit">Post</button>
        </form>
    );
}

export default PostForm;
