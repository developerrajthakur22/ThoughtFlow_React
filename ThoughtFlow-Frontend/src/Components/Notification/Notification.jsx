import { useContext, useEffect, useState } from "react";
import styles from "./Notification.module.css";
import NotificationCard from "./NotificationCard";
import { userContext } from "../../store/userContextStore";
import { BASE_URL, jwt } from "../../Utility/global";
import LinearDeterminate from "../LoaderComponent";
import CircularIndeterminate from "../LoaderComponent";
import { userId } from "../../Utility/global";

const Notification = () => {
    const [notification, setNotification] = useState([]);
    const [notificationFetched, setNotificationFetched] = useState(false);

    useEffect(() => {
        fetchNotifications(userId);
    }, []);

    const fetchNotifications = (userId) => {
        fetch(`${BASE_URL}/getNotication/${userId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        })
            .then(res => {
                if (res.status !== 200) {
                    alert("Error in fetching notification");
                } else {
                    return res.json();
                }
            })
            .then(data => {
                setNotificationFetched(true);
                setNotification(data);
            })
            .catch(error => {
                console.log("Notification error: " + error);
            });
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <h2>Profile Updates:</h2>
            {!notificationFetched ? (
                <div style={{ margin: "10% 45%" }}>
                    <CircularIndeterminate />
                </div>
            ) : notification.length === 0 ? (
                <div>No updates</div>
            ) : (
                <div className={styles.notificationList}>
                    {notification.map(notification => (
                        <NotificationCard key={notification.id} notification={notification} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notification;
