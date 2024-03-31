import { BASE_URL , jwt} from "../../Utility/global";


//API for update user
export const updateUser = (userId, userData) => {

    fetch(`${BASE_URL}/UpdateUserProfile/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res => {
        if(res.status!= 202){
            alert("Error, Please try again later!")
        }else{
            alert("User Details updated");
        }
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    })
}


//API for changing password
export const changePassword = async (id, oldPw, newPw) => {
    const url = `${BASE_URL}/ChangePassword/${oldPw}/${id}/${newPw}`;

    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });
        if (response.status == 202) {
           alert("Password changed!");
        }else{
            alert("Wrong password")
        }
    } catch (error) {
        throw new Error(`Error changing password: ${error.message}`); // Handle network errors
    }
};


//Upload user profile image
export const uploadProfilePicture = async (userId, file) => {
    const url = `${BASE_URL}/UploadProfilePic/${userId}`;

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${jwt}`
            },
            body: formData
        });

        if (response.ok) {
            alert("Profile picture updated!")
            return; // Return early if successful
        } else {
            throw new Error("Failed to upload profile picture."); // Throw error if response is not OK
        }
    } catch (error) {
        throw new Error(`Error uploading profile picture: ${error.message}`); // Handle network errors
    }
}


//Api for delete account
export const deleteAccountApi = (userId) => {
    return fetch(`${BASE_URL}/delUser/${userId}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        },
        method: "DELETE"
    })
    .then(res => {
        if(res.status == 200){
            return true;
        }else{
            return false;
        }
    })
    .catch(error => {
        console.log("Error in deleting: " + error);
    })
}