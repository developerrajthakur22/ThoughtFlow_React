import React, { useContext, useEffect, useState } from 'react';
import styles from "./People.module.css"
import { userContext } from '../../store/userContextStore';
import userImage from "../../assets/peopleImage.jpg"
import { useDispatch, useSelector } from 'react-redux';
import {FOLLOW, UNFOLLOW} from "../../redux/peopleStore"
import { useNavigate } from 'react-router-dom';
import { userId } from '../../Utility/global';

const PeopleCard = ({card, followBtn}) => {

    const navigate = useNavigate();

    const followState = useSelector(state => state.following)

    const [followToggle, setFollowToggle] = useState("");

    useEffect(()=> {
        setFollowToggle(followBtn);
    }, [followBtn])

    const dispatch = useDispatch();

    const handleFollow = (addUser, userId) => {
        let payload = {
            userId: userId,
            addUser: addUser
        }
        dispatch({type: FOLLOW, payload: payload});
        setFollowToggle("Unfollow");
    }

    const handleUnfollow = (followerId, userId) => {
        let payload = {
            userId: userId,
            followerId: followerId
        }
        dispatch({type: UNFOLLOW, payload: payload});
        setFollowToggle("Follow");
    }

    const handleFollowUnFollow = (followState) => {
       if(followState == "Follow"){
          handleFollow(card.id, userId);
       }
       else if(followState == "Unfollow"){
          handleUnfollow(card.id, userId);
       }
    }

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {/* conditional rendering for user images */}
                {
                    card.image ? 
                    <img src={`data:image/jpeg;base64,${card.image}`} alt="Profile" className={styles.image} /> :
                    <img src={userImage} alt="Profile" className={styles.image} />
                }
            </div>
            <div className={styles.info}>
                <p className={styles.name}>{card.name}</p>
                <p className={styles.username}>{`@${card.username}`}</p>
            </div>
            <div className={styles.buttons}>
                <button type="button" className= {`btn btn-primary ${styles.button}`} onClick={()=> navigate("/checkProfile", {state: {id: card.id}})}>Check Profile</button>
                <button type="button" className= {`btn btn-${followToggle == "Follow" ? "success":"danger"} ${styles.button}`} onClick= {() => handleFollowUnFollow(followToggle)}> {followToggle} </button>
            </div>
        </div>
    );
};


export default PeopleCard;
