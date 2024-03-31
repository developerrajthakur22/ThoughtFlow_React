import { useEffect, useState } from "react";
import Post from "../Post/Post";
import { useLocation } from "react-router-dom";
import { BASE_URL , jwt} from "../../Utility/global";

const UserPost = () => {

    //Catching the user's id
    const location = useLocation();

    const userId = location.state.userId;

    //User post state
    const [posts, setPosts] = useState([]);

    //Fetching the posts
    const fetchPosts = (userId) => {
        fetch(`${BASE_URL}/UserPosts/${userId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setPosts(data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    //Calling fetch post
    useEffect(()=> {
        fetchPosts(userId)
    }, []);

    return (
        <div style={{ marginTop: "20px" }}>
            {posts.length === 0 ? (
                <>
                    <hr />
                    <br />
                    <h2 style={{ textAlign: "center" }}>user don't have any post!</h2>
                </>
            ) : (
                posts.map(eachPost => (
                    <Post key={eachPost.post_id} post={eachPost} />
                ))
            )}
        </div>
    );

}

export default UserPost;