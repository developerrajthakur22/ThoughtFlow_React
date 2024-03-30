import React, { useContext, useState } from "react";
import styles from "./EditForm.module.css"; // Import CSS Module
import ChangePassword from "./ChangePassword";
import Categories from "./Categories"; // Import Categories component
import { updateUser, changePassword, uploadProfilePicture, deleteAccountApi } from "./UpdateApi"; // Import API functions
import { userContext } from "../../store/userContextStore";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { userId } from "../../Utility/global";

const EditForm = () => {

    const navigate = useNavigate();

    const userDetails = useContext(userContext);
    const user = userDetails.data;

    const [editedData, setEditedData] = useState({});
    const [categories, setCategories] = useState([]);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [file, setFile] = useState(null); // State to store the uploaded file

    const handleFormData = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            if (checked) {
                setCategories([...categories, value]);
            } else {
                setCategories(categories.filter(category => category !== value));
            }
        } else {
            if (value !== "") {
                setEditedData({ ...editedData, [name]: value });
            }
        }
    };

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };

    const handleSubmit = async () => {
        // Handle form submission
        if (categories.length !== 3 && categories.length > 0) {
            alert("You must select exactly 3 categories.");
            return; // Return early if categories are not selected properly
        }

        // Check if editedData has any keys
        if (Object.keys(editedData).length === 0 && file === null) {
            alert("No data to submit.");
            return; // Return early if no data to submit
        }

        // If categories and editedData are valid, proceed with form submission
        try {
            if (file) {
                await uploadProfilePicture(userId, file); // Upload profile picture
                userDetails.fetchUserDetails(userId);
            }
            
            if (Object.keys(editedData).length > 0) {
                editedData.categories = categories; // Add categories to editedData
                await updateUser(userId, editedData); // Update user data
                userDetails.fetchUserDetails(userId);
            }

            console.log("Form data submitted successfully.");
            setEditedData({});

        } catch (error) {
            console.error("Error submitting form:", error.message);
            // Handle error if updateUser or uploadProfilePicture function fails
        }
    };

    const handleTogglePasswordForm = () => {
        setChangePasswordVisible(!changePasswordVisible);
    };

    //Delete account api
    const deleteAccountHandler = async () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete your account?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        let res = await deleteAccountApi(userId);
                        if(res) {
                            alert("Account deleted");
                            navigate("/login");
                        } else {
                            alert("Something went wrong in deleting");
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    }

    return (
        <div className={!changePasswordVisible ? styles.editFormContainer : styles.editFormContainerPw}>
            {changePasswordVisible ? (
                <ChangePassword userId={userId}/>
            ) : (
                <>
                    <div className={styles.leftPanel}>
                        <div className={styles.formFields}>
                            <label htmlFor="name" className={styles.label}>Name:</label>
                            <input type="text" name="name" id="name" placeholder={user.name} className={styles.inputField} onChange={handleFormData} />
                            <label htmlFor="username" className={styles.label}>Username:</label>
                            <input type="text" name="username" id="username" placeholder={user.username} className={styles.inputField} onChange={handleFormData} />
                            <label htmlFor="email" className={styles.label}>Email:</label>
                            <input type="email" name="email" id="email" placeholder={user.email} className={styles.inputField} onChange={handleFormData} />
                        </div>

                        {/* input for image upload */}
                        <div className="input-group mb-3">
                            <label className="input-group-text" for="inputGroupFile01">Update Profile Image</label>
                            <input type="file" className="form-control" id="inputGroupFile01" onChange={handleFileChange} accept="image/*" />
                        </div>

                        <div className={styles.buttonGroup}>
                            <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>
                            <button className={styles.changePasswordButton} onClick={handleTogglePasswordForm}>
                                {changePasswordVisible ? "Back to Edit Profile" : "Change Password"}
                            </button>

                        </div>
                        
                    </div>
                    <div className={styles.rightPanel}>
                        {/* Render Categories component */}
                        <Categories handleFormData={handleFormData} />
                        <hr />
                        <button type="button" class="btn btn-danger" onClick={deleteAccountHandler}>Delete account <DeleteForeverIcon/> </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default EditForm;
