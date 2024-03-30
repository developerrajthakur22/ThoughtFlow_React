import React from 'react';
import styles from "./ImageCard.module.css";

const ImageCard = ({ imageUrl, name, username }) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={imageUrl} alt="User" className={styles.image} />
                {/* <div className={styles.overlay}></div> */}
            </div>
            <div className={styles.info}>
                <p className={styles.name}>{name}</p>
                <p className={styles.username}>@{username}</p>
            </div>
        </div>
    );
};

export default ImageCard;
