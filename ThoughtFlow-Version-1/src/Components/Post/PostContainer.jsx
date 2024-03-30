import { useContext, useEffect, useRef, useState } from "react";
import Post from "./Post";
import { BASE_URL, jwt, userId } from "../../Utility/global";
import { useLocation } from "react-router-dom";
import { userContext } from "../../store/userContextStore";
import SearchIcon from '@mui/icons-material/Search';

const PostContainer = () => {

    const [data, setData] = useState([]);

    const searchInput = useRef();
    

    useEffect(() => {
        fetchPost();
    }, [])

    //Search button handler
    const searchButtonHandler = () => {
        searchPostAPI(searchInput.current.value)
    }

    //Search post api
    const searchPostAPI = (keyword) => {
        fetch(`${BASE_URL}/SearchPost/${keyword}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                setData(data);
            })
    }

    //Fetching all the post
    function fetchAllPost() {
        return fetch(`${BASE_URL}/allPosts`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
    }

    //Fetching the post with user id
    function fetchPost() {
        fetch(`${BASE_URL}/Feed/${userId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                if (res.length == 0) {
                    fetchAllPost()
                        .then(res => {
                            return res.json();
                        })
                        .then(data => {
                            setData(data);
                        })
                } else {
                    setData(res);
                }
            })
    }

    const handleDeletePost = (postId) => {
        // Update the state to remove the post with the given postId
        // Example:
        setData(data.filter(post => post.post_id !== postId));
    };

    return <div style={{ marginTop: "10px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Home:</h2>
            <div class="input-group mb-2" style={{ width: "500px", marginTop: "6px" }}>
                <input type="text" class="form-control" placeholder="Search Post" aria-label="Recipient's username" aria-describedby="button-addon2" ref={searchInput} />
                <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={searchButtonHandler}><SearchIcon /></button>
            </div>
        </div>

        <div style={{ height: "550px", overflowY: "scroll", overflowX: "hidden" }}>
            {Array.isArray(data) && data.length > 0 ? (
                data.map(post => (
                    <Post key={post.post_id} post={post} onDelete={handleDeletePost} />
                ))
            ) : (
                <h2 style={{ textAlign: "center" }}>No Post available</h2>
            )}
        </div>
    </div>
}

export default PostContainer;