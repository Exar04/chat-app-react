package pkg

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"
)

type APIServer struct {
	WebSocket *websocket.Conn
	// listenAddr string
	Store Storage
}

var (
	upgrader = websocket.Upgrader{
		WriteBufferSize: 1024,
		ReadBufferSize:  1024,
		CheckOrigin: func(r *http.Request) bool {
			// Allow all connections by returning true or
			// implement your logic to check the origin here
			return true
		},
	}
	// use to store the temperory data of user connected via websocket
	WebSocketUserId = make(map[*websocket.Conn]int)
	IdToConnect     = make(map[int]*websocket.Conn)
)

func (s *APIServer) SocketHandler(w http.ResponseWriter, r *http.Request) {
	// after setting up the connection with the client
	// recent messages of that account in db should be send to the client

	ws, err := upgrader.Upgrade(w, r, nil)
	s.WebSocket = ws // this doesn't work and idk know how to make it work // actually this works but i still need to check it properly
	if err != nil {
		log.Println("there was a connection error : ", err)
		return
	}
	defer ws.Close()
	for {
		_, bytes, err := ws.ReadMessage()
		if err != nil {
			s.handleDisconnection(ws)
			break
		}
		err1 := s.handleIncomingMessage(ws, bytes)
		if err1 != nil {
			log.Print("Error handling message", err1)
		}
	}
}

// The client can send only 2 types of messages -
// either text message to another user or loigIn/signIn request
func (s *APIServer) handleIncomingMessage(sender *websocket.Conn, msg []byte) error {
	var DataRecieved message
	err := json.Unmarshal(msg, &DataRecieved)
	if err != nil {
		return err
	}

	if DataRecieved.Type == msgLogIn {
		// authorize the user and log him in
		user, err := s.Store.CheckUservalidityAndGetUser(
			DataRecieved.SendersCredentials.username,
			DataRecieved.SendersCredentials.password,
		)
		if err != nil {
			// send message to client that his crediantials were wrong
		}
		WebSocketUserId[sender] = user.Id
		IdToConnect[user.Id] = sender
		// create a websocket connection between user and server

	} else if DataRecieved.Type == msgSignIn {
		// create new account for this user
		newUser := NewUser(
			DataRecieved.SendersCredentials.username,
			DataRecieved.SendersCredentials.password,
			DataRecieved.SendersCredentials.email,
		)
		s.Store.CreateUserInDB(newUser)

	} else if DataRecieved.Type == msgChat {
		// if both the users are online( connected to server via websocket then send the message to them)
		WebsocketOfReciever, exists := IdToConnect[DataRecieved.RecieversCredentials.id /*user id of person who we want to send the message*/]
		if exists {
			// send message to reciever
			s.sendChatMessage(WebsocketOfReciever, DataRecieved.SendersCredentials.id, DataRecieved.Content.text)
		}
		// save the recieved message in database
		c_id, err := s.Store.GetConversationId(DataRecieved.SendersCredentials.id, DataRecieved.RecieversCredentials.id)
		if err != nil {
			return err
		}
		DBmsg := newDBChatMessage(DataRecieved.Content.text, c_id, DataRecieved.SendersCredentials.id)
		s.Store.SaveMessageInDB(DBmsg)

	} else if DataRecieved.Type == msgAddFriend {
		// Add friend to the users friends List
		user, err := s.Store.GetUserById(DataRecieved.SendersCredentials.id)
		if err != nil {
			return err
		}
		friendsId, err := strconv.Atoi(DataRecieved.Content.text)
		if err != nil {
			return err
		}
		friend, err := s.Store.GetUserById(friendsId)
		if err != nil {
			return err
		}

		s.Store.AddToFriendsList(user, friend)

	} else if DataRecieved.Type == msgRemoveFriend {
		// Remove friends from the users friends list
	} else if DataRecieved.Type == msgErr {
		log.Println("Error from client:", DataRecieved.Content.text)
		// Error from client
	}

	return nil
}

// don't know if this works properly
func (s *APIServer) handleDisconnection(sender *websocket.Conn) {
	// user_id, _ := WebSocketUserId[s.webSocket] // this should be used in future and remove the below ones
	user_id, _ := WebSocketUserId[sender]
	delete(WebSocketUserId, sender)
	delete(IdToConnect, user_id)
}

// add this funciton in APIServer sturct
func (s *APIServer) sendChatMessage(reciever *websocket.Conn, sender_id int, msg string) {

	m := newMessage(
		msgChat,
		// WebSocketUserId[s.webSocket], // this should be used in future and remove the below sender_id
		sender_id,
		WebSocketUserId[reciever],
		DataFromTheUserAPI{text: msg},
	)
	reciever.WriteJSON(m)
}
