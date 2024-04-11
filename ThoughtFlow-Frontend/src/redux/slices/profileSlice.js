import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, jwt } from "../../Utility/global";

//API FETCH FOLLOWERS action
export const fetchFollowerSlice = createAsyncThunk('fetchFollowers', async (userId) => {
    console.log("Followers fetching started")
    const response = await fetch(`${BASE_URL}/UserFollower/${userId}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    })

    const data = await response.json();
    return data;
})


//API FETCH FOLLOWING action
export const fetchFollowingSlice = createAsyncThunk('fetchFollowing', async (userId) => {
    console.log("Following fetching started")
    const response = await fetch(`${BASE_URL}/UserFollowing/${userId}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    })

    const data = await response.json();
    console.log("API CALLED: FOLLOWING :" + data )
    return data;
})

//API FOR UNFOLLOW
export const unfollowApi = createAsyncThunk("unfollow", async ({userId, followerId}) => {
     const response = await fetch(`${BASE_URL}/removeFollowing/${userId}/${followerId}`, {
         headers: {
             "Authorization": `Bearer ${jwt}`
            },
            method: "DELETE"
        })

     if(!response.ok){
        throw new Error("Failed to unfollow");
     }
     return
})

const INITAIL_STATE = {
    followersList : [1],
    followingList : [],
    loading: false,
    error: null
}

const profileSlice = createSlice({
    name: "Profile",
    initialState: INITAIL_STATE,
    extraReducers: (builder) => {
        builder.addCase(fetchFollowerSlice.fulfilled, (state, action) => {
            state.loading = false;
            state.followersList = action.payload 
        })
        builder.addCase(fetchFollowerSlice.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchFollowerSlice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        builder.addCase(fetchFollowingSlice.fulfilled, (state, action) => {
            state.loading = false;
            state.followingList = action.payload 
        })
        builder.addCase(fetchFollowingSlice.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchFollowingSlice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        builder.addCase(unfollowApi.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(unfollowApi.fulfilled, (state) => {
            state.loading = false;
        })
        builder.addCase(unfollowApi.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
})

export default profileSlice.reducer;