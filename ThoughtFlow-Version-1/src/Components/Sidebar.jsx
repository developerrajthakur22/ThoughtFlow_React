import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { userContext } from '../store/userContextStore';
import userLogo from "../assets/userLogo.png"
import styles from "../Components/Sidebar.module.css"

// importing icons
import HomeIcon from '@mui/icons-material/Home';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
 
const Sidebar = () => {

    const userDetails = useContext(userContext);

    const user = userDetails.data;

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary SideBar" style={{ width: '350px', marginRight: "20px" }}>
            <hr />
            {/* profile image */}
            <div className={styles.SideBarImageContainer} style={{backgroundColor: "white", border: "1px solid"}}>
                {/* conditional rendering for user image */}
                {
                    user.image ?  <img src={`data:image/jpeg;base64,${user.image}`} alt="no image" srcset="" className={styles.userImage} />
                    : <img src={userLogo} alt="no image" srcset="" className={styles.userImage} style={{height: "110%"}} />
                }
            </div>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto" style={{ textAlign: "center" }}>
                <li>
                    <NavLink exact to="/" className="nav-link link-body-emphasis" activeClassName="active">
                        {/* <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#people-circle"></use></svg> */}
                        Home <HomeIcon/>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/profile" className="nav-link link-body-emphasis">
                        {/* <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#home"></use></svg> */}
                        Profile <InsertEmoticonIcon/>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/your-post" className="nav-link link-body-emphasis">
                        {/* <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#speedometer2"></use></svg> */}
                        Your Post <SendIcon/>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/people" className="nav-link link-body-emphasis">
                        {/* <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#table"></use></svg> */}
                        People <PeopleIcon/>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/notification" className="nav-link link-body-emphasis">
                        {/* <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#people-circle"></use></svg> */}
                        Updates <NotificationsActiveIcon/>
                    </NavLink>
                </li>
            </ul>
            <hr />
        </div>
    );
}

export default Sidebar;
