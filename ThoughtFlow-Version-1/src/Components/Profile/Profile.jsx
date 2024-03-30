import { useContext, useEffect, useState } from "react";
import FollowerList from "./FollowerList";
import ProfileCard from "./ProfileCard";
import { userContext } from "../../store/userContextStore";
import { BASE_URL, jwt } from "../../Utility/global";
import { userId } from "../../Utility/global";

const Profile = () => {

    const userDetails = useContext(userContext);
    const user = userDetails.data;

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const fetchFollowers = () => {
        fetch(`${BASE_URL}/UserFollower/${userId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                setFollowers(data);
            })
    }
    const fetchFollowing = () => {
        fetch(`${BASE_URL}/UserFollowing/${userId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                setFollowing(data);
            })
    }

    const removeButtonProp = (userId, followerId) => {
        fetch(`${BASE_URL}/removeFollowing/${userId}/${followerId}`,{
            headers: {
                "Authorization": `Bearer ${jwt}`
            },
            method: "DELETE"
        })
        .then(res => {
            if(res.status != 202){
                alert("Error in removing user")
            }else{
                fetchFollowing();
            }
        })
        .catch(error => {
            console.log("Error in removing user: " + error);
        })
    }
    
    useEffect(() => {
        fetchFollowing();
        fetchFollowers();
    }, []);

    
    return <div style={{ marginTop: "20px" }}>
        <h2>Profile:</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ProfileCard user={user} followerCount={followers.length} followingCount={following.length} imgCard={false} />
            <FollowerList followList={following} type={"following"} removeButtonProp={removeButtonProp} />
            <FollowerList followList={followers} type={"followers"} />
        </div>
    </div>
}
export default Profile;
