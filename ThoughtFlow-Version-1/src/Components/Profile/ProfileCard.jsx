import { useContext } from "react";
import { userContext } from "../../store/userContextStore";
import myImage from "../../assets/peopleImage.jpg"
import ImageCard from "../check-Profile/ImageCard";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ user, followerCount, followingCount, imgCard }) => {

  const navigate = useNavigate();

  // Check if user data is not available yet
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card" style={{ width: "20rem" }}>

      {/* conditional rendering with image card */}
      <div className="card-body">
        {
          imgCard ?
            <ImageCard imageUrl={user.image ? `data:image/jpeg;base64,${user.image}` : myImage} name={user.name} username={user.username} /> :
            <>
              <h5 className="card-title"><b>Username:</b> {user.username}</h5>
              <hr />
            </>
        }

        <p className="card-text"><b>Email:</b> {user.email}</p>
        <p className="card-text"><b>Followers:</b> {followerCount}</p>
        <p className="card-text"><b>Following:</b> {followingCount}</p>
        <hr />
      </div>
      <h4 className="card-text" style={{ margin: "0px 0px 15px 15px" }}><b>Categories:</b></h4>
      <ul className="list-group list-group-flush">
        {!user.postCategory || user.postCategory.length === 0 ? (
          <li className="list-group-item">Empty!</li>
        ) : (
          user.postCategory.map((category, index) => (
            <li key={index} className="list-group-item">{category}</li>
          ))
        )}
      </ul>
      <div className="card-body">
        {
          imgCard ?
            <button type="button" className="btn btn-primary" onClick={()=>navigate("/user-post", {state: {userId: user.id}})} >User posts</button> :
            <>
              <button type="button" className="btn btn-primary" style={{ marginRight: "20px" }} onClick={()=> navigate("/edit-profile")}>Edit profile</button>
              <button type="button" className="btn btn-primary" onClick={()=>navigate("/your-post")}>Your posts</button>
            </>
        }
      </div>
    </div>
  );
};

export default ProfileCard;
