import { ChatSection } from "../components/ChatSection"
import { FriendsList } from "../components/FriendsList"
import { NavBar } from "../components/NavBar"
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import { Login } from "./Login"
import { ApiMessage, newApiMessage } from "../types/api"
import WebSocketProvider from "../services/sox"

interface ChatPageProps {
    //     UserId: number | undefined 
    //     UserName: string | undefined
}

// export const ChatSection: React.FC<ChatProps> = ({ selectedChatId, userId }) => {
export const ChatPage: React.FC<ChatPageProps> = (/*{UserId, UserName}*/) => {
    const divstyleCalcHeight = {
        height: "calc(100vh - 50px)"
    }

    const [loggedIn, setLoggingIn] = useState<boolean>(false)
    const [UserId, setUserId] = useState<number>()
    const [UserName, setUserName] = useState<string>('Undefined')
    const [selectedChatsId, setSelectedChatsId] = useState<number>();
    const [ApiData, setApiData] = useState<ApiMessage>()

    // useEffect(() => {
    //     setupSocketListeners((receivedData: ApiMessage) => {
    //         setApiData(receivedData)
    //     });
    // }, []);

    // useEffect(() => {
    //     console.log(ApiData)
    // },[ApiData])

    return (
        <WebSocketProvider>
            {loggedIn ?
            <div>
                <NavBar UserId={UserId} UserName={UserName} />

                <div className="container text-center bg-white bg-gradient min-vw-100 min-vh-100">
                    <div className="row row-col-4  min-vw-100" style={divstyleCalcHeight}>
                        <FriendsList selectChatId={setSelectedChatsId} UserId={UserId} /*receivedData={ApiData}*/ />
                        <ChatSection selectedChatId={selectedChatsId} UserId={UserId} /* receivedData={ApiData} */ />
                    </div>
                </div>

            </div>
            :
            <Login
                setLogIn={setLoggingIn}
                setUserId={setUserId}
                setUserName={setUserName}
                /* receivedData={ApiData} */ />}
        </WebSocketProvider>
    )
}