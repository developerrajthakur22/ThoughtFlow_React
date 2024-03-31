import { useContext } from "react";
import Post from "../Post/Post";
import { postContext } from "../../store/UserPostContextStore";

const YourPost = () => {
    const { getAllPost, deletePost } = useContext(postContext);

    const posts = getAllPost;

    return (
        <div style={{ marginTop: "20px" }}>
            {posts.length === 0 ? (
                <>
                    <hr />
                    <br />
                    <h2 style={{ textAlign: "center" }}>You don't have any post!</h2>
                </>
            ) : (
                posts.map(eachPost => (
                    <Post key={eachPost.post_id} post={eachPost} onDelete={() => deletePost(eachPost.post_id)} />
                ))
            )}
        </div>
    );
}

export default YourPost;
    