import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import { useSocketSubscribe, useWebSocketSender } from "../services/sox"
import { ApiMessage, newApiMessage } from "../types/api"

interface ChatProps {
    selectedChatId: number | undefined
    UserId: number | undefined
    // receivedData: ApiMessage | undefined
}

interface ChatData {
    data: string
    m_id: number
    sender: number
}

interface ChatMapType {
    // Here id is friends_id/the id we have in our chat and chatData[] the messages associated with that id
    [id: number]: ChatData[];
}

export const ChatSection: React.FC<ChatProps> = ({ selectedChatId, UserId }) => {
    // export const ChatSection = (selectedChatsId: number) => {
    const divStyle = {
        height: "calc(100% - 100px)"
    }
    const friend = "MyFriend"
    const sendThisMessageToServer = useWebSocketSender()

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

        const msg = newApiMessage('message',-1,UserId!,selectedChatId!,-1)
        sendThisMessageToServer(msg)
        const chatObj: ChatData = {
            data: message,
            m_id: chatMap[selectedChatId!].length - 1,
            sender: UserId!
        }
        addObjectsToChatMap(selectedChatId!, [chatObj])

    }
    // var msg_idTotal: number
    useEffect(() => {
        // i just want to get the chats if i have not already recieved
        // if i have already requested them don't request to server again
        if (!chatMap[selectedChatId!]) {
            // when -1 is used as lastmessage_id it fetches the latest messages if any positive integer is used then messages will be fetched from that id specified 
            if (selectedChatId! && selectedChatId != 0) {
            // const msg = JSON.stringify(newApiMessage('getPreviousChats', -1, -1, -1, selectedChatId!))
            // socket.send(msg) // create a json and send it to the server requesting the initial messages of that group/personal chat
            sendThisMessageToServer(newApiMessage('getPreviousChats', -1, -1, -1, selectedChatId!))

            }
        }
    }, [selectedChatId])


        const handleSocketUpdate = (receivedData: ApiMessage) => {
            if (receivedData!.type === 'message') {
                const chatObj: ChatData = {
                    data: receivedData!.content.text,
                    m_id: receivedData!.content.m_id /* configure message id */,
                    sender: receivedData!.sendersCredentials.id
                }
                addObjectsToChatMap(selectedChatId!, [chatObj])
            } else if (receivedData!.type === 'getPreviousChats') {
                // even though this looks same as above we are going to change it later
                // when we add feature of loading previous chats incrementally
                // then we need to add previous chats before current messages
                // But for now this is fine
                const chatObj: ChatData = {
                    data: receivedData!.content.text,
                    m_id: receivedData!.content.m_id /* configure message id */,
                    sender: receivedData!.sendersCredentials.id
                }

                addObjectsToChatMap(selectedChatId!,[chatObj])
            }
        };
        useSocketSubscribe(handleSocketUpdate);

    // useEffect(() => {
    //     // if (!socket.current) return
    //     if (socket && socket.current) {


    //     socket.current.onmessage = (event: MessageEvent) => {
    //         const receivedData: ApiMessage = JSON.parse(event.data);
    //         if (receivedData!.type === 'message') {
    //             const chatObj: ChatData = {
    //                 data: receivedData!.content.text,
    //                 m_id: receivedData!.content.m_id /* configure message id */,
    //                 sender: receivedData!.sendersCredentials.id
    //             }
    //             addObjectsToChatMap(selectedChatId!, [chatObj])
    //         } else if (receivedData!.type === 'getPreviousChats') {
    //             // even though this looks same as above we are going to change it later
    //             // when we add feature of loading previous chats incrementally
    //             // then we need to add previous chats before current messages
    //             // But for now this is fine
    //             const chatObj: ChatData = {
    //                 data: receivedData!.content.text,
    //                 m_id: receivedData!.content.m_id /* configure message id */,
    //                 sender: receivedData!.sendersCredentials.id
    //             }

    //             addObjectsToChatMap(selectedChatId!,[chatObj])
    //         }
    //     }}
    //   }, [socket]);

    // useEffect(() => {
    //     // keep getting messages from the server
    //     socket.onmessage = (event) => {
    //     }
    // }, [])
    return (
        <div className="row col m-4 p-3 bg-secondary-subtle shadow-lg rounded ">
            <div className="p-2 bg-black text-white rounded-4">{friend}</div>
            <div className="m-0 p-1  w-100 overflow-y-scroll container" style={divStyle}>
                {selectedChatId ? listChats :
                    <div className=" fs-2 text-secondary  ">No room selected</div>}
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