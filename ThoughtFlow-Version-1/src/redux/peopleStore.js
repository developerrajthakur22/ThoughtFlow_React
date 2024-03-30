import { createStore } from "redux"
import { BASE_URL, jwt } from "../Utility/global"

//Define actions
export const FOLLOW = "FOLLOW"
export const UNFOLLOW = "UNFOLLOW"

//Notification api
const notificationApi = (recipent, userId) => {
    fetch(`${BASE_URL}/createFollowNoti/${recipent}/${userId}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`,
        },
        method: "POST"
    })
    .catch(error => {
        console.log("Error in sending notification: " + error);
    })
}

//Api function for follow and unfollow
const followApi = (addUser, userId) => {
    fetch(`${BASE_URL}/addToFollowing/${addUser}/${userId}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`,
        },
        method: "POST"
    })
    .then(res => {
        if(res.status != 200){
            alert("Error in follow button!, try later")
        }else{
            notificationApi( userId, addUser);
        }
    })
    .catch(error => {
        console.log("Error: " + error);
    })   
}

const unfollowApi = (userId, followerId) => {
    fetch(`${BASE_URL}/removeFollowing/${userId}/${followerId}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        },
        method: "DELETE"
    })
    .then(res => {
        if(res.status != 202){
            alert("Error in unfollow button!, try later: code::" + res.status)
        }
    })
    .catch(error => {
        console.log("Error: " + error);
    })   
}

const INITIAL_VALUE = {
     following: ""
}

const followButtonReducer = (store = INITIAL_VALUE, action) => {
    console.log("Action recieved: " + action.type)
    if(action.type == "FOLLOW"){
        let userId = action.payload.userId;
        let addUser = action.payload.addUser;
        store.following = "Unfollow"
        followApi(userId, addUser);
    }
    else if(action.type == "UNFOLLOW"){
        let userId = action.payload.userId;
        let followerId = action.payload.followerId;
        store.following = "Follow"
        unfollowApi(userId, followerId);
    }
    return store;
}

const peopleStore = createStore(followButtonReducer);

export default peopleStore;

