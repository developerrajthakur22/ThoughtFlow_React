import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Utility/global";

export const addUserFunction = async (userObj) => {

    try {
        const response = await fetch(`${BASE_URL}/addUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObj)
        });

        if (response.ok) { // Checking for any 2xx status code
            alert("Account created successfully!");
            window.location.href = "/Login"
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle any network or other errors here
        alert("An error occurred. Please try again later.");
    }
};
