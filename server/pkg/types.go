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
	text string
	// Support for these file types will be added soon
	// audio
	// video
	//pdf
}
type UserCredentials struct {
	cache    string
	username string
	password string
	email    string
	id       int
}
type message struct {
	Type                 ApiMessageType     `json:"type"`
	Content              DataFromTheUserAPI `json:"content"`
	SendersCredentials   UserCredentials    `json:"sendersCredentials"`
	RecieversCredentials UserCredentials    `json:"recieversCredentials"`
	Date                 time.Time          `json:"date"`
	Success              bool               `json:"success"`
}

type ApiMessageType string

const (
	msgSignIn       ApiMessageType = "signIn"
	msgLogIn        ApiMessageType = "logIn"
	msgChat         ApiMessageType = "message"
	msgAddFriend    ApiMessageType = "addFriend"
	msgRemoveFriend ApiMessageType = "removeFriend"
	msgErr          ApiMessageType = "error"
	msgUserList     ApiMessageType = "Users"
)

func newMessage(msgType ApiMessageType, sender int, reciever int, content DataFromTheUserAPI) message {
	return message{
		Type:                 msgType,
		SendersCredentials:   UserCredentials{id: sender},
		RecieversCredentials: UserCredentials{id: reciever},
		Content:              content,
		Date:                 time.Now().UTC(),
		Success:              true,
	}
}

func newError(content string) message {
	return message{
		Type:    msgErr,
		Content: DataFromTheUserAPI{text: content},
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
