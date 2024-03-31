import React, { useContext, useEffect, useState } from 'react';
import { BASE_URL, jwt } from '../../Utility/global';
import { userContext } from '../../store/userContextStore';
import DeleteIcon from '@mui/icons-material/Delete';
import { userId } from '../../Utility/global';

const Comments = ({ post, deleteComment }) => {

    //Post id
    const postId = post.post_id
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchComments(postId)
    }, [newComment]);

    //Comment Notification
    const commentNotification = (userId, recipentId, postId) => {
        fetch(`${BASE_URL}/createCommentNoti/${recipentId}/${userId}/${postId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            },
            method: "POST"
        })
    }

    //fetch the comment
    function fetchComments(postId) {
        fetch(`${BASE_URL}/PostComments/${postId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log(res)
                setComments(res);
            })
    }

    //Post a comment
    function postComment(userID, postId, comment){
        return fetch(`${BASE_URL}/CommentPost/${postId}/${userID}/${comment}`,{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
    }

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handlePostComment = () => {
        if (newComment.trim() !== '') {
            postComment(userId, postId, newComment)
            .then(res => {
                if(res.status == 202){
                    setComments([...comments, newComment]);
                    setNewComment('');
                    commentNotification(userId, post.user.id , postId,)
                }
                else{
                    alert("error while commenting")
                }
            })
        }
    };

    const handleDeleteComment = (index, entry) => {
        const updatedComments = [...comments];
        updatedComments.splice(index, 1);
        deleteComment(postId, entry)
        setComments(updatedComments);
    };

    // Delete comment api call
    

    return (
        <div style={{ marginTop: "20px" }}>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', marginBottom: '10px' }}>
                {comments.map((entry, index) => {
                    const username = Object.keys(entry)[0]; // Extracting the username
                    const commentData = entry[username]; // Extracting the comment data
                    return (
                        <div key={index} style={{ marginBottom: '5px', padding: '5px', borderBottom: '1px solid #ccc' }}>
                            <div><strong>{username}</strong></div>
                            <div><strong>Comment:</strong> {commentData.comment}</div>
                            <button className='btn btn-outline-danger btn-sm' onClick={() => handleDeleteComment(index, commentData)} style={{ margin: "5px 10px" }}><DeleteIcon/></button>
                        </div>
                    );
                })}

            </div>
            <textarea value={newComment} onChange={handleCommentChange} style={{ width: '100%', marginBottom: '5px' }}></textarea>
            <button className='btn btn-outline-primary btn-sm' onClick={handlePostComment}>Post Comment</button>
        </div>
    );
};

export default Comments;
