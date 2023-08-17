
import "bootstrap/dist/css/bootstrap.min.css"
import { FormEvent, useEffect, useState } from "react"
import { ApiMessage, UserCredentials } from "../types/api"
import { socket, setupSocketListeners } from "../services/webSocketUtil"
import { useNavigate } from "react-router-dom"

interface LoginPageProps {
    setUserId: React.Dispatch<React.SetStateAction<number | undefined>>
    setLogIn: React.Dispatch<React.SetStateAction<boolean >>
    setUserName: React.Dispatch<React.SetStateAction<string >>

}

export const Login: React.FC<LoginPageProps> = ({ setUserId, setLogIn }) => {
    const [Id, setId] = useState<string>('')
    const [password, setpassword] = useState<string>('')

    const sendLoginRequest = (event: FormEvent) => {
        event.preventDefault()

        console.log('login request was sent')
        const loginReq: ApiMessage = {
            type: "logIn",
            convo_id: -1,
            content: {
                text: "",
                m_id: -1
            },
            sendersCredentials: {
                id: Number(Id),
                cache: "",
                username: "",
                password: password,
                email: ""
            },
            friendsCredentials: {
                id: -1,
                cache: "",
                username: "",
                password: "",
                email: ""
            },
            date: new Date(),
            success: true
        }

        const msg = JSON.stringify(loginReq)
        socket.send(msg)
    }

    useEffect(() => {

            setupSocketListeners((receivedData: ApiMessage) => {
                // Your logic for handling messages in FriendsList component
                // const receivedData: ApiMessage = JSON.parse(event.data)

                if (receivedData.type === 'logIn') {
                    if (receivedData.success === true) {
                        console.log("ok user login successful")

                        setUserId(Number(Id))

                        const getFriendsListFromServer: ApiMessage = {
                            type: "getFriendsList",
                            convo_id: -1,
                            content: {
                                text: "",
                                m_id: -1
                            },
                            sendersCredentials: {
                                id: Number(Id),
                                cache: "",
                                username: "",
                                password: "",
                                email: ""
                            },
                            friendsCredentials: {
                                id: -1,
                                cache: "",
                                username: "",
                                password: "",
                                email: ""
                            },
                            date: new Date(),
                            success: true
                        }
                        const msg = JSON.stringify(getFriendsListFromServer)
                        socket.send(msg)
                        setLogIn(true)
                        // save the cache key so that whenever user again tries to visit website it will automatically get redirected
                    } else {
                        // show error on the screen
                        alert("something went wrong!")
                    }
                }
            });

    },[]);

    // socket.onmessage = (event) => {
    // }

    return (
        <div>
            <div className="container d-flex justify-content-center min-vh-100 align-items-center">
                <div className="p-4 bg-white shadow-lg rounded-3 bg-gradient ">

                    <form>
                        <h1 className=" text-center ">LOGIN</h1>
                        <div className="form-group">
                            <label >Id</label>
                            <input type="id" className="form-control" placeholder="Id"
                                value={Id} onChange={e => setId(e.target.value)} />

                        </div>
                        <div className="form-group">
                            <label >Password</label>
                            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password"
                                value={password} onChange={e => setpassword(e.target.value)} />
                        </div>

                        <div className=" d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary m-4 " onClick={sendLoginRequest}>Submit</button>
                        </div>
                        <div className=" d-flex justify-content-center">
                            <a href="/signIn">New user?</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}