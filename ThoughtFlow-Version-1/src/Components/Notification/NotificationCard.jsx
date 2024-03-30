import React from 'react';
import styles from './NotificationCard.module.css';
import followLogo from '../../assets/follow.png';
import likeLogo from '../../assets/like.jpg';

const NotificationCard = ({ notification }) => {
    let notificationText = '';

    // Format date and time
    const formattedDateTime = new Date(notification.createdAt).toLocaleString();

    // Check the type of notification and build the notification text accordingly
    if (notification.type === 'Comment') {
        notificationText = `${notification.sender.name} (@${notification.sender.username}) commented on your post "${notification.post.title}"`;
    } else if (notification.type === 'Like') {
        notificationText = `${notification.sender.name} (@${notification.sender.username}) liked your post "${notification.post.title}"`;
    } else if (notification.type === 'Follow') {
        notificationText = `${notification.sender.name} (@${notification.sender.username}) started following you`;
    }

    return (
        <div className={`${styles.notificationCard} ${notification.type === 'Follow' ? styles.followIcon : styles.likeIcon}`}>
            <div className={styles.notificationIcon}>
                <img src={notification.type === 'Follow' ? followLogo : likeLogo} alt="" />
            </div>
            <div className={styles.notificationContent}>
                <span className={styles.notificationText}>{notificationText}</span>
                <span className={styles.notificationDateTime}>{formattedDateTime}</span>
            </div>
        </div>
    );
};

export default NotificationCard;
