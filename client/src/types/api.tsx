export interface DataFromTheUserAPI {
    text: string;
}

export interface UserCredentials {
    cache: string;
    username: string;
    password: string;
    email: string;
    id: number;
}

export interface MessageApi {
    type: ApiMessageType;
    content: DataFromTheUserAPI;
    sendersCredentials: UserCredentials;
    othersCredentials: UserCredentials; // this field is named recieversCredentials in backend
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
    | 'YourFriend'; 
