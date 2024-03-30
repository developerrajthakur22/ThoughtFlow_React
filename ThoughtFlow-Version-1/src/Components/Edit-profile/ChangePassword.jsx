import React, { useRef } from "react";
 import style from "./EditForm.module.css";
import styles from "./ChangePassword.module.css"
import {useNavigate} from "react-router-dom"
import { changePassword } from "./UpdateApi";

const ChangePassword = ({userId}) => {

    const navigate = useNavigate();

    const currentPassword = useRef();
    const newPassword = useRef();
    const confirmPassword = useRef();

    const handleChangePassword = async () => {
        // Handle password change
        let currentPw =currentPassword.current.value;
        let newPw = newPassword.current.value;
        let ConfirmPw = confirmPassword.current.value;

        if(currentPw == "" || newPw == ""){
            alert("Password values can not be blank!")
            return
        }

        if(newPw != ConfirmPw){
            alert("Check the confirm password again!");
            return;
        }

        if(newPw.length > 20 || newPw.length < 5){
            alert("Length of password should be greater than 5 and smaller than 20 characters!");
            return
        }

        await changePassword(userId, currentPw, newPw);
    };

    return (
        <div className={styles.changePasswordContainer}>
            <h2>Change Password:</h2>
            <input ref={currentPassword} type="password" placeholder="Current Password" name="currentPassword" className={style.inputField}/>
            <input ref={newPassword} type="password" placeholder="New Password" name="newPassword" className={style.inputField}/>
            <input ref={confirmPassword} type="password" placeholder="Confirm New Password" name="confirmPassword" className={style.inputField}/>
            <div className={styles.buttonContainer}>
            <button type="button" class="btn btn-success" onClick={handleChangePassword}>Submit</button>
            <button type="button" class="btn btn-primary" onClick={()=> navigate("/profile")}>Go back to edit Profile</button>
            </div>
        </div>
    );
};

export default ChangePassword;
