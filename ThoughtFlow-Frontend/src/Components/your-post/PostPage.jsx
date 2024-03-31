// PostPage.js
import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../store/userContextStore';
import PostForm from './PostForm';
import YourPost from './YourPost';
import UserPostContextProvider from '../../store/UserPostContextStore';

const PostPage = () => {

    return (
        <div style={{ marginTop: "20px" }}>
            <UserPostContextProvider>
                <PostForm/>
                <YourPost/>
            </UserPostContextProvider>
        </div>
    );
}

export default PostPage;
