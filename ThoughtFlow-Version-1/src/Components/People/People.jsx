import PeopleCard from "./PeopleCard";
import styles from "./People.module.css"
import { useEffect, useState, useContext, useRef } from "react";
import { userContext } from "../../store/userContextStore";
import { BASE_URL, jwt } from "../../Utility/global";
import SearchIcon from '@mui/icons-material/Search';

const People = () => {

    let [data, setData] = useState([]);
    let [following, setFollowing] = useState([]);
    const searchInput = useRef();

    //Search button handler
    const searchButtonHandler = () => {
        searchPeopleAPI(searchInput.current.value);
    }

    //Search people api call
    const searchPeopleAPI = (keyword) => {
        fetch(`${BASE_URL}/SearchUser/${keyword}`,{
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

    useEffect(() => {
        fetchFollowing();
        peopleApi();
    }, []); // empty dependency array to run once on mount

    function peopleApi() {
        fetch(`${BASE_URL}/allUser`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                setData(res);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }

    const fetchFollowing = () => {
        fetch(`${BASE_URL}/UserFollowing/${1}`, {
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

    return (
        <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>People:</h2>
                <div class="input-group mb-2" style={{ width: "500px", marginTop: "6px" }}>
                    <input type="text" class="form-control" placeholder="Search User" aria-label="Recipient's username" aria-describedby="button-addon2" ref={searchInput}/>
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={searchButtonHandler}><SearchIcon /></button>
                </div>
            </div>

            <div className={styles.peopleContainer}>
                {data.length === 0 && <h2>No data found</h2>}
                {data.map(card =>
                    following.some(followedUser => followedUser.id === card.id) ?
                        (<PeopleCard card={card} followBtn={"Unfollow"} />) :
                        (<PeopleCard card={card} followBtn={"Follow"} />)
                )}

                {/* Add more PeopleCard components here if needed */}
            </div>

        </div>
    );
}

export default People;
