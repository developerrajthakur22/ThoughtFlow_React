import { Outlet } from "react-router-dom";
import { userContext } from "../store/userContextStore";
import { useEffect, useContext } from "react";
import { Provider } from "react-redux";
import peopleStore from "../redux/peopleStore";
import { store } from "../redux/store";

const Container = () => {

    // const userDetailsContext = useContext(userContext);

    //  useEffect(() => {
    //      // Fetch user details when the component mounts
    //      userDetailsContext.fetchUserDetails(1);
    //  }, []); // Empty dependency array ensures this effect runs only once on mount

    return <div className="container" style={{backgroundColor: "#f2f2f2"}}>
        {/* <Post/> */}
        {/* <Profile/> */}
        <Provider store={store}>
        <Provider store={peopleStore}>
            <Outlet />
        </Provider>
        </Provider>
    </div>

}

export default Container;