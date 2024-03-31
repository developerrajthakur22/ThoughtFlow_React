import { useContext, useEffect, useState } from "react";
import { userContext } from "../store/userContextStore";
import { Link, useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FaceIcon from '@mui/icons-material/Face';
import { getCookie, parseJwt } from "../Utility/global";
import { userId } from "../Utility/global";
import { jwt } from "../Utility/global";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const Header = () => {

  const navigate = useNavigate();

  const [loginStatus, setLoginStatus] = useState("Login");
  const userDetails = useContext(userContext);
  let username = userDetails.data.name;  

  //If page get's refresh then it will again call fetch user to fetch the userdata
  useEffect(() => {
        userDetails.fetchUserDetails(userId);
        if(!jwt){
          alert("Session expired!")
          window.location.href = "/Login"
        }
  }, []);

  useEffect(() => {
    if (username) {
      setLoginStatus("Logout")
    } else {
      setLoginStatus("Login")
    }
  }, [userDetails])

  //Logout handler delete the jwt from cookie and navigate to login page
  const logoutHandler = async () => {
    confirmAlert({
        title: 'Confirm to Logout',
        message: 'Are you sure you want to logout?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => {
                  document.cookie = `jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                  navigate("/Login")
                }
            },
            {
                label: 'No',
                onClick: () => {
                  navigate("/")
                }
            }
        ]
    });
}

  let aTag = {
    fontSize: "22px"
  }

  return <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark" style={{ height: "70px" }}>
    <div className="container-fluid">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarColor02">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" style={aTag} onClick={logoutHandler}> {loginStatus} <ExitToAppIcon /></Link>
          </li>
          <li className="nav-item">
            {/* <a className="nav-link active" href="#" style={aTag}>{`|| Welcome, ` + username}</a> */}
          </li>
          <a className="navbar-brand" href="#" style={{ fontSize: "28px", marginLeft: "500px" }}>ThoughtFlow</a>
        </ul>
        <form className="d-flex" role="search">
          {/* <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-light" type="submit">Search</button> */}
          <a className="nav-link active" href="#" style={{ marginRight: "20px", fontSize: "25px", color: "white" }}>{`Welcome, ` + username} <FaceIcon /> </a>
        </form>
      </div>
    </div>
  </nav>
}

export default Header;