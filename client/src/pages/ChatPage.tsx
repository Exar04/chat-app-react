import { ChatSection } from "../components/ChatSection"
import { FriendsList } from "../components/FriendsList"
import { NavBar } from "../components/NavBar"
import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from "react"

export const ChatPage = () => {
    const divstyleCalcHeight = {
        height: "calc(100vh - 50px)"
    }
    const [selectedChatsId, setSelectedChatsId] = useState<number >();

    return (
        <div>
            <NavBar />

            <div className="container text-center bg-white bg-gradient min-vw-100 min-vh-100">
                <div className="row row-col-4  min-vw-100" style={divstyleCalcHeight}>
                    <FriendsList  selectChatId={setSelectedChatsId} />
                    <ChatSection selectedChatId={selectedChatsId} />
                </div>
            </div>

        </div>
    )
}