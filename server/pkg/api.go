package pkg

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"
)

type APIServer struct {
	// WebSocket         *websocket.Conn
	ClientConnections map[*websocket.Conn]struct{}
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
	// recent messages of that account in db should be send to the client || this has not been implemented yet

	ws, err := upgrader.Upgrade(w, r, nil)
	// s.WebSocket = ws // this doesn't work and idk know how to make it work // actually this works but i still need to check it properly // actually this didn't work
	if err != nil {
		log.Println("there was a connection error : ", err)
		return
	}
	defer ws.Close()

	s.ClientConnections[ws] = struct{}{}

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
	fmt.Println(DataRecieved)

	if DataRecieved.Type == msgLogIn {
		// authorize the user and log him in
		user, err := s.Store.CheckUservalidityAndGetUser(
			DataRecieved.SendersCredentials.Id,
			DataRecieved.SendersCredentials.Password,
		)

		if err != nil {
			// UserLoginFailedMsg := DataFromTheUserAPI{Text: "Failed"} // Text: fmt.Sprintf("%s \n credentials me be wrong", err),
			// errMsg := newMessage(msgLogIn, -1, -1, UserLoginFailedMsg)
			errMsg := message{
				Type:    msgLogIn,
				Success: false,
			}
			fmt.Println(err)
			sender.WriteJSON(errMsg)
			return err
			// send message to client that his crediantials were wrong
		}

		WebSocketUserId[sender] = user.Id
		IdToConnect[user.Id] = sender

		// UserLoginSuccessfulMsg := newMessage(msgLogIn, -1, -1, DataFromTheUserAPI{Text: "Successful"}) // maybe instead of successful send something else like a token
		UserLoginSuccessfulMsg := message{
			Type:    msgLogIn,
			Success: true,
		}
		// send firends list of that user
		fList, err := s.Store.GetUsersFriends(user.Id)
		if err != nil {
			return err
		}

		sender.WriteJSON(UserLoginSuccessfulMsg)

		for key, value := range fList {
			fmsg := message{
				Type:               msgAddFriend,
				FriendsCredentials: UserCredentials{Id: key},
				Convo_id:           value,
			}
			sender.WriteJSON(fmsg)
		}

		fmt.Println(WebSocketUserId[sender], "was connected")
		// create a websocket connection between user and server

	} else if DataRecieved.Type == msgSignIn {
		// create new account for this user
		newUser := NewUser(
			DataRecieved.SendersCredentials.Username,
			DataRecieved.SendersCredentials.Password,
			DataRecieved.SendersCredentials.Email,
		)
		err := s.Store.CreateUserInDB(newUser)
		if err != nil {
			UserLoginSuccessfulMsg := newMessage(msgSignIn, -1, -1, DataFromTheUserAPI{Text: "Failed"}) // maybe instead of failed send something else like a token
			IdToConnect[DataRecieved.SendersCredentials.Id].WriteJSON(UserLoginSuccessfulMsg)
		}

	} else if DataRecieved.Type == msgChat {
		// if both the users are online( connected to server via websocket then send the message to them)
		WebsocketOfReciever, exists := IdToConnect[DataRecieved.FriendsCredentials.Id /*user id of person who we want to send the message*/]
		if exists {
			// send message to reciever
			s.sendChatMessage(WebsocketOfReciever, DataRecieved.SendersCredentials.Id, DataRecieved.Content.Text)
		}
		// save the recieved message in database
		c_id, err := s.Store.GetConversationId(DataRecieved.SendersCredentials.Id, DataRecieved.FriendsCredentials.Id)
		if err != nil {
			return err
		}
		DBmsg := newDBChatMessage(DataRecieved.Content.Text, c_id, DataRecieved.SendersCredentials.Id)
		s.Store.SaveMessageInDB(DBmsg)

	} else if DataRecieved.Type == msgAddFriend {
		// Add friend to the users friends List
		user, err := s.Store.GetUserById(DataRecieved.SendersCredentials.Id)
		if err != nil {
			return err
		}
		friendsId, err := strconv.Atoi(DataRecieved.Content.Text)
		if err != nil {
			return err
		}
		friend, err := s.Store.GetUserById(friendsId)
		if err != nil {
			return err
		}

		s.Store.AddToFriendsList(user, friend)

		// send client new friends list if friend successfully added else send unsuccessful message
	} else if DataRecieved.Type == msgUserWantsPreviousChatsFromDb {
		// send 10 chats of the conversations id user has send
		con_id, err := s.Store.GetConversationId(DataRecieved.SendersCredentials.Id, DataRecieved.FriendsCredentials.Id)
		if err != nil {
			return err
		}

		messageStuff, err := s.Store.GetChatFromThisChatRoom(con_id)
		if err != nil {
			return err
		}

		for _, data := range messageStuff {
			sendThismsg := message{
				Type: msgUserWantsPreviousChatsFromDb,
				Content: DataFromTheUserAPI{
					message_id: data.Message_id,
					Text:       data.Data,
				},
				SendersCredentials: UserCredentials{
					Id: data.Sender_id,
				},
				Date: data.SendAt,
			}

			sender.WriteJSON(sendThismsg)
		}

	} else if DataRecieved.Type == msgRemoveFriend {
		// Remove friends from the users friends list
	} else if DataRecieved.Type == msgErr {
		log.Println("Error from client:", DataRecieved.Content.Text)
		// Error from client
	}
	return nil
}

// don't know if this works properly
func (s *APIServer) handleDisconnection(sender *websocket.Conn) {
	// user_id, _ := WebSocketUserId[s.webSocket] // this should be used in future and remove the below ones
	user_id, _ := WebSocketUserId[sender]
	delete(s.ClientConnections, sender)
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
		DataFromTheUserAPI{Text: msg},
	)
	reciever.WriteJSON(m)
}
