import React, { useState } from "react";
import styles from "./SignUp.module.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Categories from "../Edit-profile/Categories";
import { addUserFunction } from "./addUserApi";

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        feedCategory: [],
    });
    const [file, setFile] = useState(null);

    const handleFormData = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            setFormData({
                ...formData,
                feedCategory: checked
                    ? [...formData.feedCategory, value]
                    : formData.feedCategory.filter((category) => category !== value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            let formDataWithoutConfirmPassword = { ...formData };

            // Remove confirmPassword field from formData
            delete formDataWithoutConfirmPassword.confirmPassword;

            // If file is selected, add image field with base64 data to formData
            if (file) {
                formDataWithoutConfirmPassword = {
                    ...formDataWithoutConfirmPassword,
                    image: file,
                };

                // Submit form data without confirmPassword field and with image field
                console.log("Form data submitted successfully:", formDataWithoutConfirmPassword);
                console.log("Selected file:", file);
                // Make API call here
                addUserFunction(formDataWithoutConfirmPassword);
            } else {
                // Submit form data without confirmPassword field and without image field
                console.log("Form data submitted successfully:", formDataWithoutConfirmPassword);
                // Make API call here
                addUserFunction(formDataWithoutConfirmPassword);
            }
        } catch (error) {
            console.error("Error submitting form:", error.message);
        }
    };

    const validateForm = () => {
        const { name, username, email, password, confirmPassword } = formData;

        if (!name || !username || !email || !password || !confirmPassword) {
            alert("Please fill in all required fields.");
            return false;
        }

        if (!/@\w+\./.test(email)) {
            alert("Wrong email format, Please correct it!");
            return false;
        }

        if (username.length < 4 && name.length < 2) {
            alert("Username should not be less than 4 characters");
            return false;
        }

        if (password !== confirmPassword || password.length < 5 || password.length > 20) {
            alert("Passwords must match and be between 6 and 20 characters.");
            return false;
        }

        if (formData.feedCategory.length !== 3) {
            alert("You must select exactly 3 categories.");
            return false;
        }

        return true;
    };

    // Inside your handleFileChange function in the frontend
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Read the selected image file as a data URL
            const reader = new FileReader();

            reader.onload = (event) => {
                // Get the data URL of the selected file

                const base64ImageData = event.target.result.split(',')[1];

                // Set the byte array as the file state
                setFile(base64ImageData);
            };

            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <div className={styles.container}>
            <img className={styles.image} src={logo} alt="" width="210" height="60" style={{ borderRadius: "40px" }} />
            <div className={styles.editFormContainer}>
                <div className={styles.leftPanel}>
                    <div className={styles.formFields}>
                        <label htmlFor="name" className={styles.label}>
                            Name:
                        </label>
                        <input type="text" name="name" id="name" className={styles.inputField} placeholder="Name" onChange={handleFormData} />
                        <label htmlFor="username" className={styles.label}>
                            Username:
                        </label>
                        <input type="text" name="username" id="username" className={styles.inputField} placeholder="Username" onChange={handleFormData} />
                        <label htmlFor="email" className={styles.label}>
                            Email:
                        </label>
                        <input type="email" name="email" id="email" className={styles.inputField} placeholder="Email" onChange={handleFormData} />
                        <label htmlFor="password" className={styles.label}>
                            Password:
                        </label>
                        <input type="password" name="password" id="password" className={styles.inputField} placeholder="Set Password" onChange={handleFormData} />
                        <input type="password" name="confirmPassword" className={styles.inputField} placeholder="Confirm Password" onChange={handleFormData} />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button className={styles.submitButton} onClick={handleSubmit}>
                            Submit
                        </button>
                        <button className={styles.changePasswordButton} onClick={() => navigate("/login")}>
                            Login page
                        </button>
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    <Categories handleFormData={handleFormData} />
                    <hr />
                    <div className="input-group mb-3">
                        <label className="input-group-text" htmlFor="inputGroupFile01">
                            Set Profile Image
                        </label>
                        <input type="file" className="form-control" id="inputGroupFile01" accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
