import { ChatSection } from "../components/ChatSection"
import { FriendsList } from "../components/FriendsList"
import { NavBar } from "../components/NavBar"
import "bootstrap/dist/css/bootstrap.min.css"

export const ChatPage = () => {
    const divstyleCalcHeight = {
        height: "calc(100vh - 50px)"
    }
    return (
        <div>

    <NavBar />

    <div className="container text-center bg-white bg-gradient min-vw-100 min-vh-100">
        <div className="row row-col-4  min-vw-100" style={divstyleCalcHeight}>
            <FriendsList />
            <ChatSection />
        </div>
    </div>

        </div>
    )
}