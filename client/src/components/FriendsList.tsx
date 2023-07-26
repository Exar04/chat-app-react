import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from "react"

export const FriendsList = () => {
    const [Friends, setFriendo] = useState(['yash', 'Tanish'])
    const listFriends = Friends.map(friend =>

        <div className="m-1 p-3 bg-dark shadow-lg rounded-5 text-white ">
            <div className="row ">
                <img src="blank_profile_picture.webp" className="img-fluid col-3 rounded-circle" alt="" />
                <div className="col">
                   {friend} 
                </div>
            </div>
        </div>
    )
    return (
        <div className="list-group-item col-1 m-4 p-4 bg-secondary-subtle w-25 shadow-lg rounded align-items-center">
            <div className="input-group p-4">
                <input type="text" className=" form-control rounded-start-5 bg-white bg-gradient border-" placeholder="Add friend using Id" />
                <button className="  btn  rounded-end-5 bg-dark-subtle">Add</button>
            </div>
            {listFriends}
        </div>
    )
}