import { useState, useEffect } from "react";
import FollowerList from "../Profile/FollowerList";
import ProfileCard from "../Profile/ProfileCard";
import { BASE_URL } from "../../Utility/global";
import { useLocation } from "react-router-dom";
import { jwt } from "../../Utility/global";

const CheckProfile = () => {

    const location = useLocation();

    const userId = location.state.id;

    const [user, setUserData] = useState();
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

    //Fetch user Details
    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/UserProfile/${userId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${jwt}`
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
            const data = await response.json();
            setUserData(data); // Update userData state with fetched data
            return data;
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    };

    useEffect(()=> {
        fetchUserDetails(userId)
        fetchFollowers();
        fetchFollowing();
    }, []);

    return <div style={{marginTop: "20px"}}>
        <h2>Profile:</h2>
        <div style={{ display: "flex", justifyContent: "space-between"}}>
            <ProfileCard user={user} followerCount={followers.length} followingCount={following.length} imgCard={true}/>
                <FollowerList followList={following} type={"following"} checkProfile={true}/>
                <FollowerList followList={followers} type={"followers"}/>
        </div>
    </div>
}

export default CheckProfile;