import { ChatSection } from "../components/ChatSection"
import { FriendsList } from "../components/FriendsList"
import { NavBar } from "../components/NavBar"
import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from "react"
import { Login } from "./Login"

interface ChatPageProps {
    //     UserId: number | undefined 
    //     UserName: string | undefined
}

// export const ChatSection: React.FC<ChatProps> = ({ selectedChatId, userId }) => {
export const ChatPage: React.FC<ChatPageProps> = (/*{UserId, UserName}*/) => {
    const [loggedIn, setLoggingIn] = useState<boolean>(false)
    const [UserId, setUserId] = useState<number>()
    const [UserName, setUserName] = useState<string>('Undefined')

    const divstyleCalcHeight = {
        height: "calc(100vh - 50px)"
    }
    const [selectedChatsId, setSelectedChatsId] = useState<number>();

    return (
        loggedIn ?
            <div>
                <NavBar UserId={UserId} UserName={UserName} />

                <div className="container text-center bg-white bg-gradient min-vw-100 min-vh-100">
                    <div className="row row-col-4  min-vw-100" style={divstyleCalcHeight}>
                        <FriendsList selectChatId={setSelectedChatsId} UserId={UserId} />
                        <ChatSection selectedChatId={selectedChatsId} UserId={UserId} />
                    </div>
                </div>

            </div>
            :
            <Login 
            setLogIn={setLoggingIn} 
            setUserId={setUserId} 
            setUserName={setUserName}  />
    )
}