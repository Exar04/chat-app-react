package pkg

import (
	"time"
)

type User struct {
	Id        int       `json:"id"`
	UserName  string    `json:"username"`
	Password  string    `json:"password"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
}

type Conversations struct {
	Conversation_id int `json:"conversation_id"`
	User            int `json:"user1_id"`
	UsersFriend     int `json:"user2_id"`
}

type DBChatMessage struct {
	Message_id      int       `json:"message_id"`
	Conversation_id int       `json:"conversation_id"`
	Sender_id       int       `json:"sender_id"`
	Data            string    `json:"message"`
	SendAt          time.Time `json:"SendAt"`
}
type DataFromTheUserAPI struct {
	message_id int
	Text       string

	// Support for these file types will be added soon
	// audio
	// video
	// pdf
}
type UserCredentials struct {
	Cache    string
	Username string
	Password string
	Email    string
	Id       int
}

// senderCredentials -
// used for loggin in user
// used for signing in user
// used for checking who send the chatMessage user

type message struct {
	Type               ApiMessageType     `json:"type"`
	Convo_id           int                `json:"convo_id"`
	Content            DataFromTheUserAPI `json:"content"`
	SendersCredentials UserCredentials    `json:"sendersCredentials"`
	FriendsCredentials UserCredentials    `json:"friendsCredentials"`
	Date               time.Time          `json:"date"`
	Success            bool               `json:"success"`
}

type ApiMessageType string

const (
	msgSignIn                       ApiMessageType = "signIn"
	msgLogIn                        ApiMessageType = "logIn"
	msgChat                         ApiMessageType = "message"
	msgAddFriend                    ApiMessageType = "addFriend" // when client sends this request it adds friend in database when server send it, client adds it to the list
	msgRemoveFriend                 ApiMessageType = "removeFriend"
	msgErr                          ApiMessageType = "error"
	msgUserList                     ApiMessageType = "Users"
	msgUserWantsPreviousChatsFromDb ApiMessageType = "getPreviousChats"
	msgUserWantsHisFriendsList      ApiMessageType = "getFriendsList"
)

func newMessage(msgType ApiMessageType, sender int, reciever int, content DataFromTheUserAPI) message {
	return message{
		Type:               msgType,
		SendersCredentials: UserCredentials{Id: sender}, //UserCredentials{id: sender},
		FriendsCredentials: UserCredentials{Id: reciever},
		Content:            content,
		Date:               time.Now().UTC(),
		Success:            true,
	}
}

func newError(content string) message {
	return message{
		Type:    msgErr,
		Content: DataFromTheUserAPI{Text: content},
		Date:    time.Now().UTC(),
		Success: false,
	}
}

func NewUser(username, password, email string) *User {
	return &User{
		UserName:  username,
		Password:  password,
		Email:     email,
		CreatedAt: time.Now().UTC(),
	}
}

func newDBChatMessage(msg string, conversation_id int, sender_id int) *DBChatMessage {
	// find conversation_id between users
	return &DBChatMessage{
		Conversation_id: conversation_id,
		Sender_id:       sender_id,
		Data:            msg,
		SendAt:          time.Now().UTC(),
	}
}
