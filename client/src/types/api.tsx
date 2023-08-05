export interface DataFromTheUserAPI {
    m_id: number
    text: string
}

export interface UserCredentials {
    cache: string;
    username: string;
    password: string;
    email: string;
    id: number;
}

export interface ApiMessage {
    type: ApiMessageType;
    content: DataFromTheUserAPI;
    sendersCredentials: UserCredentials;
    recieversCredentials: UserCredentials; // this field is named recieversCredentials in backend
    date: Date;
    success: boolean;
}

export type ApiMessageType =
    // client sends these types to backend
    | 'signIn'
    | 'logIn'
    | 'message'
    | 'addFriend'
    | 'removeFriend'
    | 'error'
    | 'Users'
    // backend sends these types to client
    | 'YourFriend'
    | 'getChats'


export function newApiMessage(msgType: ApiMessageType, lastMessage_id: number,su_id: number,ru_id: number): ApiMessage {
    const msg: ApiMessage = {
        type: msgType, 
        content:  {
            text: "",
            m_id: -1,
        },
        sendersCredentials: {
            cache: "",
            username:"", 
            password:"", 
            email:"", 
            id: su_id, 
        },
        recieversCredentials: {
            cache: "",
            username:"", 
            password:"", 
            email:"", 
            id: ru_id, 
        },
        date: new Date(),
        success:true,

    }
    return msg
}