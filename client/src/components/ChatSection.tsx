
import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from "react"
export const ChatSection = () => {
    const divStyle = {
        height: "calc(100% - 100px)"
    }

    const friend = "MyFriend"

    const [chats, setchats] = useState([
        { id: 1, data: "hi", sender: 0 },
        { id: 2, data: "How are you?", sender: 0 },
        { id: 3, data:"hi", sender:1},
        { id: 4, data:"How are you?", sender:1},
        { id: 5, data:"I am fine", sender:0},
        { id: 6, data:"I am fine too", sender:1},
    ])

    const listChats = chats.map(chat =>
        <div key={chat.id}>
            {chat.sender === 1 ? (
                <div className=" d-flex justify-content-start">
                    <div className=" bg-info rounded-4 p-1 w-50 m-1">
                        {chat.data}
                    </div>
                </div>
                ) :
                (
                    <div className=" d-flex justify-content-end">
                        <div className=" bg-info rounded-4 p-1 w-50 m-1">
                            {chat.data}
                        </div>
                    </div>
                )
            }
        </div>
    );

    return (
        <div className="row col m-4 p-3 bg-secondary-subtle shadow-lg rounded ">
        <div className="p-2 bg-black text-white rounded-4">{ friend }</div>
        <div className="m-0 p-1  w-100 overflow-y-scroll container" style={divStyle}>
            {listChats}
        </div>
        <div className="input-group mb-3 p-4">
            <input v-model="messageFromMe" type="text" className="form-control rounded-start-5 bg-white bg-gradient border-0"
                placeholder="Say hey..." aria-label="Recipient's username" aria-describedby="button-addon2" />
            <button className="btn btn-outline-secondary rounded-end-5" type="button"
                id="button-addon2">
                Button
            </button>
        </div>
    </div>
    )
}