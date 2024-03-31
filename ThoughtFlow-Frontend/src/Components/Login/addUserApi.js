import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Utility/global";

export const addUserFunction = (userObj) => {
    let flag = false;
    console.log(userObj)
    fetch(`${BASE_URL}/addUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
    })
        .then(response => {
            if(response.status == 202){
                flag = true;
            }
            return response.json();
        })
        .then(data => {
            if(flag == true){
                alert("Accound created")
                window.location.href = "/login"
            }else{
                alert(data.message);
            }
            console.log(data)
        })
        .catch((error) => {
            console.error("Error adding user:", error);
        });
}