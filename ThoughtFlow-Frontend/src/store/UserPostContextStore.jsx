import { createContext, useContext, useState, useEffect } from "react";
import { userContext } from "./userContextStore";
import { BASE_URL, jwt } from "../Utility/global";
import { userId } from "../Utility/global";


export const postContext = createContext({
    getAllPost: [],
    deletePost: () => { },
    addNewPost: () => { }
})


//Context provider creation
const UserPostContextProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);

    //Fetching the posts
    const fetchPosts = () => {
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

    useEffect(() => {
        fetchPosts();
    }, []); // Run once on mount

    //Function update all posts state after adding new post
    const addPost = (newPost) => {
        setPosts(prevPosts => [...prevPosts, newPost]);
    }

    //Add New posts api
    const makePostApiCall = (post) => {
        fetch(`${BASE_URL}/AddPost/1`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${jwt}`
            },
            method: "POST",
            body: JSON.stringify(post)
        })
            .then(res => {
                if (res.status == 200 || res.status == 202) {
                    alert("Posted successfully!");
                }
                return res.json();
            })
            .then(data => {
                addPost(data);
            })
            .catch(error => {
                console.log(error)
            })
    }

    //function that updates all the posts after deleting new post
    const deletePost = (postId) => {
        setPosts(posts.filter(post => post.post_id !== postId))
    }

    return <postContext.Provider value={{
        getAllPost: posts,
        deletePost: deletePost,
        addNewPost: makePostApiCall
    }}>
        {children}
    </postContext.Provider>

}

export default UserPostContextProvider;
