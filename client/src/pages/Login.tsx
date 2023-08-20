
import "bootstrap/dist/css/bootstrap.min.css"
import { FormEvent, useContext, useEffect, useState } from "react"
import { SocketContext, useSocketSubscribe, useWebSocketSender } from "../services/sox"
import { ApiMessage, UserCredentials } from "../types/api"

interface LoginPageProps {
    setUserId: React.Dispatch<React.SetStateAction<number | undefined>>
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>
    setUserName: React.Dispatch<React.SetStateAction<string>>
    // receivedData: ApiMessage | undefined
}

export const Login: React.FC<LoginPageProps> = ({ setUserId, setLogIn }) => {
    const [Id, setId] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const sendThisMessageToServer = useWebSocketSender()
    // const { socket } = useWebSocket()
    // const [receivedMessage, setReceivedMessage] = useState<ApiMessage>();
    // const [messageToSend, setMessageToSend] = useState('');

    const handleSocketUpdate = (receivedData: ApiMessage) => {
        // setReceivedMessage(message);
        // const receivedData: ApiMessage = JSON.parse();

            if (receivedData.type === 'logIn') {
                console.log('entered login section')
                if (receivedData.success === true) {
                    console.log("ok user login successful")

                    setUserId(Number(Id))
                    setLogIn(true)

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
                    // const msg = JSON.stringify(getFriendsListFromServer)
                    console.log('getting friends list')
                    sendThisMessageToServer(getFriendsListFromServer)

                    // socket.send(msg)
                    // save the cache key so that whenever user again tries to visit website it will automatically get redirected
                } else {
                    // show error on the screen
                    alert("something went wrong!")
                }
            }
        };

    useSocketSubscribe(handleSocketUpdate);

    const sendLoginRequest = (event: FormEvent) => {
        event.preventDefault()
            // Check if socket exists and is open before sending the message
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

            // const msg = JSON.stringify(loginReq)
            // socket.send(msg)
            sendThisMessageToServer(loginReq)
            // Your message sending code...

    }

        // if (!socket.current) return
    // useEffect(() => {

    //         setupSocketListeners((receivedData: ApiMessage) => {
    //             // Your logic for handling messages in FriendsList component
    //             // const receivedData: ApiMessage = JSON.parse(event.data)

    //             if (receivedData.type === 'logIn') {
    //                 if (receivedData.success === true) {
    //                     console.log("ok user login successful")

    //                     setUserId(Number(Id))

    //                     const getFriendsListFromServer: ApiMessage = {
    //                         type: "getFriendsList",
    //                         convo_id: -1,
    //                         content: {
    //                             text: "",
    //                             m_id: -1
    //                         },
    //                         sendersCredentials: {
    //                             id: Number(Id),
    //                             cache: "",
    //                             username: "",
    //                             password: "",
    //                             email: ""
    //                         },
    //                         friendsCredentials: {
    //                             id: -1,
    //                             cache: "",
    //                             username: "",
    //                             password: "",
    //                             email: ""
    //                         },
    //                         date: new Date(),
    //                         success: true
    //                     }
    //                     const msg = JSON.stringify(getFriendsListFromServer)
    //                     socket.send(msg)
    //                     setLogIn(true)
    //                     // save the cache key so that whenever user again tries to visit website it will automatically get redirected
    //                 } else {
    //                     // show error on the screen
    //                     alert("something went wrong!")
    //                 }
    //             }
    //         });

    // },[]);

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