import FollowCard from "./FollowCard";

const FollowerList = ({followList, type, checkProfile, removeButtonProp}) => {

    return <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary" style={{ width: "350px", maxHeight: "570px", minHeight: "550px", border: "1px solid", overflowY: "scroll" }}>
        <a href="/" className="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom">
            <svg className="bi pe-none me-2" width="30" height="24"><use xlink:href="#bootstrap"></use></svg>
            <span className="fs-5 fw-semibold">{type == "followers" ? "Followers":"Following"}</span>
        </a>
        <div className="list-group list-group-flush border-bottom scrollarea" style={{ overflowY: "scroll"  }}>
            {/* list starts from here */}
            
            {followList.map(card => (
                <FollowCard key = {card.id} card = {card} type = {type} checkProfile={checkProfile} removeButtonProp= {removeButtonProp}/>   
            ))}

        </div>
    </div>

}

export default FollowerList;