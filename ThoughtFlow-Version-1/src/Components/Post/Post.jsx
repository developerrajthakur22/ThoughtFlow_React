import React, { useState, useEffect } from "react";
import Comments from "./Comments";
import { BASE_URL, jwt } from "../../Utility/global";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import { userId } from "../../Utility/global";

const Post = ({ post, onDelete }) => {

    const [comments, showComments] = useState(false);
    const [likeCount, setLikeCount] = useState(post.postLikes.length);
    const [like, setLike] = useState("Like");
    const [likeButtonClass, setLikeButtonClass] = useState("btn-primary");

    useEffect(() => {
        // Check if the current user has already liked the post
        const isLiked = post.postLikes.some((likeEntry) => likeEntry.user === userId);
        // Set the initial state based on whether the user has liked the post or not
        setLike(isLiked ? "Liked" : "Like");
        setLikeButtonClass(isLiked ? "btn-danger" : "btn-outline-danger");
    }, [post, userId]);

    //Like notification endpoint
    const likeNotification = (postId, userId, recipentId) => {
        fetch(`${BASE_URL}/createLikeNoti/${recipentId}/${userId}/${postId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });
    }

    const LikePost = (postId, userId) => {
        return fetch(`${BASE_URL}/LikePost/${postId}/${userId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
    };

    const unLikePost = (postId, userId) => {
        return fetch(`${BASE_URL}/UnlikePost/${postId}/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });
    };

    //Toggle the like button
    const postLikeEvent = () => {
        if(like == "Like"){
             LikePost(post.post_id, userId)
            .then((res) => {
                if (res.status === 202) {
                    likeNotification(post.post_id, userId, post.user.id);
                    setLikeCount(likeCount + 1);
                    setLike("Liked");
                    setLikeButtonClass("btn-danger");
                } 
            })
        }else{
            unLikePost(post.post_id, userId)
            .then((res)=> {
                if(res.status == 202){
                    setLikeCount(likeCount - 1);
                    setLike("Like");
                    setLikeButtonClass("btn-outline-danger");
                }
            })
        }
    };


    //Delete function
    const handleDelete = () => {
        fetch(`${BASE_URL}/removePost/${post.post_id}/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
        .then(response => {
            if (response.ok) {
                // If the post was successfully deleted, call onDelete
                onDelete(post.post_id);
            } else {
                // Handle error responses
                console.error("Error deleting post:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error deleting post:", error);
        });
    };
    
    //Delete a comment API Call
    const deleteComment = (postId, comment) => {
        fetch(`${BASE_URL}/deleteAComment/${postId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            method: "DELETE",
            body: JSON.stringify(comment)
        })
        .then(res => {
            if(res.status != 202){
                alert("Error in deleting comment");
            }
        })
        .catch(error => {
            console.log("Comment error: " + error);
        })
    }

    //function to pass as prop to get the comment body to delete the commment
    const handleCommentDelete = (postId, comment) => {
          deleteComment(postId, comment);
    }

    const formattedDateTime = new Date(post.date).toLocaleString();

    return (
        <div className="col-md-6" style={{ minWidth: "1090px" , backgroundColor: "white"}}>
            <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div className="col p-4 d-flex flex-column position-static">
                    <strong className="d-inline-block mb-2 text-primary-emphasis">{`@${post.user.username}`}</strong>
                    <h3 className="mb-0">{post.title}</h3>
                    <div className="mb-1 text-body-secondary">{formattedDateTime}</div>
                    <p className="card-text mb-auto"> {post.tweet} </p>
                    <div className="post-buttonDiv">
                        <button type="button" className={`btn ${likeButtonClass} btn-sm`} onClick={postLikeEvent}>{like == "Like" ? <FavoriteBorderIcon/> : <FavoriteIcon/>} {`(${likeCount})`}</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => showComments(!comments)}><CommentIcon/> Comment</button>
                        {/* conditional rendering for delete button */}
                        {
                            post.user.id == userId &&
                            <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}><DeleteIcon/></button>
                        }
                    </div>
                    {comments && <Comments post={post} deleteComment={handleCommentDelete}/>}
                </div>
            </div>
        </div>
    );
};

export default Post;
