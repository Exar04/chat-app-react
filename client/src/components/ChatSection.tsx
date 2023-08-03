import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import socket from "../services/webSocketUtil"
import { MessageApi } from "../types/api"

interface ChatProps {
    selectedChatId: number | undefined
}

interface ChatData {
    data: string
    m_id: number
    sender: number
}

interface ChatMapType {
    [id: number]: ChatData[];
}

export const ChatSection: React.FC<ChatProps> = ({ selectedChatId }) => {
    // export const ChatSection = (selectedChatsId: number) => {
    const divStyle = {
        height: "calc(100% - 100px)"
    }

    const friend = "MyFriend"

    const [chatMap, setChatMap] = useState<ChatMapType>({});
    // useEffect to get initial messages from db and later from the other client via websocket 
    // use this method when user sends message or message is recieved
    const addObjectsToChatMap = (id: number, objects: ChatData[]) => {
        setChatMap(prevChatMap => ({
            ...prevChatMap,
            //   [id]: objects
            [id]: [...(prevChatMap[id] || []), ...objects]
        }));
    };

    // const [chats, setchats] = useState([
    //     { m_id: 1, data: "hi", sender: 0 },
    //     { m_id: 2, data: "How are you?", sender: 0 },
    //     { m_id: 3, data: "hi", sender: 1 },
    //     { m_id: 4, data: "How are you?", sender: 1 },
    //     { m_id: 5, data: "I am fine", sender: 0 },
    //     { m_id: 6, data: "I am fine too", sender: 1 },
    // ])
    var listChats
    if (selectedChatId !== undefined) {
        listChats = chatMap[selectedChatId].map(chat =>
            <div key={chat.m_id}>
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
        )
    }

    const [message, getChangedMessageFromInputField] = useState('')
    function sendMessage() {
        // send message to server and add it in chatMap
        // addObjectsToChatMap() 
    }

    useEffect(() => {
        // i just want to get the chats if i have not already recieved
        // if i have already requested them don't request to server again
        
        if(selectedChatId ? !chatMap[selectedChatId]: undefined){
            socket.send("") // create a json and send it to the server requesting the initial message
        }



    }, [selectedChatId])
    useEffect(() => {

            socket.onmessage = (event) => {
                const receivedData: MessageApi = JSON.parse(event.data)
                if (receivedData.type == 'message') {
                    const chatObj: ChatData =  {data:'adsf', m_id: 0 /* configure message id */,sender:receivedData.sendersCredentials.id}
                    addObjectsToChatMap(selectedChatId ? selectedChatId : -1 ,[chatObj])
                }
            }
        // keep getting messages from the server
    },[])

    return (
        <div className="row col m-4 p-3 bg-secondary-subtle shadow-lg rounded ">
            <div className="p-2 bg-black text-white rounded-4">{friend}</div>
            <div className="m-0 p-1  w-100 overflow-y-scroll container" style={divStyle}>
                {listChats}
            </div>
            <div className="input-group mb-3 p-4">
                <input value={message} onChange={e => getChangedMessageFromInputField(e.target.value)}
                    className="form-control rounded-start-5 bg-white bg-gradient border-0"
                    type="text" placeholder="Say hey..." aria-label="Recipient's username" aria-describedby="button-addon2" />

                <button onClick={sendMessage} className="btn btn-outline-secondary rounded-end-5" type="button"
                    id="button-addon2">
                    Button
                </button>
            </div>
        </div>
    )
}