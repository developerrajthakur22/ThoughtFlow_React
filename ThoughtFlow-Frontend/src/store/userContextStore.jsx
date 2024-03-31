import { createContext, useState } from "react";
import { BASE_URL, jwt } from "../Utility/global";

export const userContext = createContext({
    fetchUserDetails: () => {},
    data: {},
});

const UserDetailsProvider = ({ children }) => {
    const [userData, setUserData] = useState({});

    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/UserProfile/${userId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${jwt}`
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
            const data = await response.json();
            setUserData(data); // Update userData state with fetched data
            return data;
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    };

    return (
        <userContext.Provider
            value={{
                fetchUserDetails: fetchUserDetails,
                data: userData, // Pass fetched data in context value
            }}
        >
            {children}
        </userContext.Provider>
    );
};

export default UserDetailsProvider;
