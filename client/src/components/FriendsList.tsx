import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import { useSocketSubscribe, useWebSocketSender } from "../services/sox";
import { ApiMessage, ApiMessageType } from "../types/api"

interface FriendInfo {
    id: number;
    Uid: number;
    name: string;
}
interface FriendsListProps {
    selectChatId: React.Dispatch<React.SetStateAction<number | undefined>>
    UserId: number | undefined
    // receivedData: ApiMessage | undefined
}

export const FriendsList: React.FC<FriendsListProps> = ({ selectChatId, UserId }) => {
    const [Friends, setFriendo] = useState<FriendInfo[]>([])
    const sendThisMessageToServer = useWebSocketSender()
    // Listen for messages from the server
        const handleSocketUpdate = (receivedData: ApiMessage) => {
            if (receivedData.type === "addFriend") {
                console.log("Adding friend to friend list ...")
                const FriendForList: FriendInfo = {
                    id: Friends.length,
                    name: receivedData.friendsCredentials.username,
                    Uid: receivedData.friendsCredentials.id
                }

                setFriendo([...Friends, FriendForList])
            }
        };
        useSocketSubscribe(handleSocketUpdate);
        ////////////////////////////////////////////////

    const SelectThisFriendOnClick = (id: number) => {
        // selectfriend(id)
        selectChatId(id)
    }


    const listFriends = Friends.map(friend =>
        <div key={friend.id} onClick={() => SelectThisFriendOnClick(friend.id)} className="m-1 p-3 bg-dark shadow-lg rounded-5 text-white ">
            <div className="row ">
                <img src="blank_profile_picture.webp" className="img-fluid col-3 rounded-circle" />
                <div className="col">
                    {friend.name}
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