package pkg

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type Storage interface {
	CreateUserInDB(*User) error
	DeleteUserFromDB(*User) error
	GetUserById(int) (*User, error)
	SaveMessageInDB(*DBChatMessage) error
	AddToFriendsList(user *User, friend *User) error
	RemoveFriend(user *User, friend *User) error
	CheckUservalidityAndGetUser(id int, password string) (*User, error)
	GetConversationId(user1_id, user2_id int) (int, error)
	GetUsersFriends(user_id int) (map[int]int, error)
	GetChatFromThisChatRoom(convo_id int) ([]DBChatMessage, error)
}

type PostgresStore struct {
	db *sql.DB
}

func NewPostgresStore() (*PostgresStore, error) {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	// connStr := "user=yash password=yash dbname=WebChats sslmode=disable"

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return &PostgresStore{
		db: db,
	}, nil
}

func (s *PostgresStore) Init() error {
	if err := s.CreateUserTable(); err != nil {
		return err
	}
	if err := s.CreateConversationsTable(); err != nil {
		return err
	}
	if err := s.CreateChatMessageTable(); err != nil {
		return err
	}
	return nil
}

func (s *PostgresStore) CreateUserTable() error {
	query := `
	create table if not exists "User"(
		user_id serial primary key,
		username varchar(225),
		password varchar(225),
		email varchar(225) unique, 
		createdAt timestamp
	)`
	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) CreateConversationsTable() error {
	query := `
	create table if not exists Conversations(
		conversation_id serial primary key,
		"user" integer references "User" (user_id),       
		userFriend integer references "User" (user_id)
	)`
	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) CreateChatMessageTable() error {
	query := `
	create table if not exists ChatMessage(
		Message_id serial primary key,
		Conversation_id integer references conversations(conversation_id),       
		Sender_id integer references "User"(user_id),       
		Data            text,       
		SendAt          timestamp 
	)`
	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) CreateUserInDB(user *User) error {
	// we have to create new func newUser to make user and then use this function to add that user to the database
	query := `
	insert into "User" (username, password, email, createdAt)
	values ( $1, $2, $3, $4)`

	_, err := s.db.Exec(query, user.UserName, user.Password, user.Email, user.CreatedAt)
	return err
}

func (s *PostgresStore) DeleteUserFromDB(*User) error {
	return nil
}

func (s *PostgresStore) GetUserById(user_id int) (*User, error) {
	var userFound User
	query := `
	select * from "User"
	where user_id=$1 `

	err := s.db.QueryRow(query, user_id).Scan(&userFound.Id, &userFound.UserName, &userFound.Password, &userFound.Email, &userFound.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &userFound, nil

}

func (s *PostgresStore) GetConversationId(user1_id, user2_id int) (int, error) {
	var conversation_id int
	query := `
		select conversation_id from Conversations
		where
		("user"=$1 AND userFriend=$2)
		OR
		("user"=$3 AND userFriend=$4) `

	err := s.db.QueryRow(query, user1_id, user2_id, user2_id, user1_id).Scan(&conversation_id)
	if err != nil {
		return -1, err
	}
	return conversation_id, nil
}

func (s *PostgresStore) CheckUservalidityAndGetUser(id int, password string) (*User, error) {
	var exists bool
	var TrueUser User
	query1 := `
        SELECT EXISTS (SELECT 1 FROM "User" WHERE user_id = $1)
    `

	err := s.db.QueryRow(query1, id).Scan(&exists)
	if err != nil {
		log.Println("User doesn't exist in the database")
		return nil, err
	}

	if exists {
		query2 := `
            SELECT user_id, username, password, email, createdAt
			FROM "User"
			WHERE user_id = $1
        `

		err := s.db.QueryRow(query2, id).Scan(&TrueUser.Id, &TrueUser.UserName, &TrueUser.Password, &TrueUser.Email, &TrueUser.CreatedAt)

		if err != nil {
			return nil, err
		}
		if password == TrueUser.Password {
			return &TrueUser, nil
		}
	}
	return nil, errors.New("Password doesn't match")
}

func (s *PostgresStore) AddToFriendsList(user *User, friend *User) error {
	query := `
	insert into Conversations("user", userFriend)
	values ($1, $2)`

	_, err := s.db.Exec(query, user.Id, friend.Id)
	return err
}

func (s *PostgresStore) RemoveFriend(user *User, friend *User) error {

	return nil
}

// save recieved message in database
func (s *PostgresStore) SaveMessageInDB(message *DBChatMessage) error {

	query := `
	insert into ChatMessage(Conversation_id, Sender_id, Data, SendAt)
	values ($1, $2, $3, $4) `

	_, err := s.db.Exec(query, message.Conversation_id, message.Sender_id, message.Data, message.SendAt)

	return err
}

func (s *PostgresStore) GetUsersFriends(user_id int) (map[int]int, error) {
	// var FriendsListAndConvoId []struct {
	// 	convo_id   int
	// 	friends_id int
	// }

	// In this FriendsListAndConvoId map [int] is friends_id and is mapped to its convo_id
	// I am using map because i don't want to check on which side is the friends id
	// I will just dump all of em on key side and duplicates will automatically get removed
	FriendsListAndConvoId := make(map[int]int)

	query := `
	select * from Conversations 
	where 
	"user" = $1 OR userFriend = $2
	`
	rows, err := s.db.Query(query, user_id, user_id)
	if err != nil {
		fmt.Println("err occured in getUsersFriends 1")
		return nil, err
	}

	for rows.Next() {
		var conv_id int
		var friends_id int
		var userho int

		err := rows.Scan(&conv_id, &userho, &friends_id)
		if err != nil {
			fmt.Println("err occured getUsersFriends 2")
			return nil, err
		}

		if userho == user_id {
			FriendsListAndConvoId[friends_id] = conv_id
		} else {
			FriendsListAndConvoId[userho] = conv_id
		}
	}

	defer rows.Close()
	return FriendsListAndConvoId, nil
}

func (s *PostgresStore) GetChatFromThisChatRoom(convo_id int) ([]DBChatMessage, error) {
	var FriendsListAndConvoId []DBChatMessage

	query := `
	select * from ChatMessage 
	where conversation_id = $1
	limit $2 
	`
	// Later add get chats according to time
	rows, err := s.db.Query(query, convo_id, 10)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var dabdab DBChatMessage

		err := rows.Scan(&dabdab.Message_id, &dabdab.Conversation_id, &dabdab.Sender_id, &dabdab.Data, &dabdab.SendAt)
		if err != nil {
			return nil, err
		}
		FriendsListAndConvoId = append(FriendsListAndConvoId, dabdab)
	}
	defer rows.Close()

	return FriendsListAndConvoId, nil
}
