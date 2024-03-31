import { useContext } from "react";
import { userContext } from "../../store/userContextStore";
import { userId } from "../../Utility/global";

const FollowCard = ({card, type, checkProfile,removeButtonProp}) => {

    const handleRemove = () => {
        removeButtonProp(userId, card.id);
    }

    return <a href="#" className="list-group-item list-group-item-action py-3 lh-sm" aria-current="true">
        <div className="d-flex w-100 align-items-center justify-content-between">
            <strong className="mb-1">{card.name}</strong>
            {type == "followers" || checkProfile || (<button className='btn btn-danger btn-sm' onClick={handleRemove}>Remove</button>)}
            {/* <small>Wed</small> */}
        </div>
        <div className="col-10 mb-1 small">{`@${card.username}`}</div>
    </a>

}

export default FollowCard;