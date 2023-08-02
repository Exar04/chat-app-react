package pkg

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

type Storage interface {
	CreateUserInDB(*User) error
	DeleteUserFromDB(*User) error
	GetUserById(int) (*User, error)
	SaveMessageInDB(*DBChatMessage) error
	AddToFriendsList(user *User, friend *User) error
	RemoveFriend(user *User, friend *User) error
	CheckUservalidityAndGetUser(username, password string) (*User, error)
	GetConversationId(user1_id, user2_id int) (int, error)
	GetInitialMessages(Conversation_id int) ([]message, error)
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

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)

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

func (s *PostgresStore) CheckUservalidityAndGetUser(username, password string) (*User, error) {
	var exists bool
	var TrueUser User
	query1 := `
        SELECT EXISTS (SELECT 1 FROM "User" WHERE username = $1)
    `

	err := s.db.QueryRow(query1, username).Scan(&exists)
	if err != nil {
		log.Println("User doesn't exist in the database")
		return nil, err
	}

	if exists {
		query2 := `
            SELECT user_id, username, password, email, createdAt
			FROM "User"
			WHERE username = $1
        `

		err := s.db.QueryRow(query2, username).Scan(&TrueUser.Id, &TrueUser.UserName, &TrueUser.Password, &TrueUser.Email, &TrueUser.CreatedAt)

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

func (s *PostgresStore) GetInitialMessages(Conversation_id int) ([]message, error) {
	var bunchOfMessages []message

	query := `
	select * from ChatMessage
	where Conversation_id=$1
	limit $2
	`
	// add get message were date > somedate, thus removing limit and instead replace it with where date > date given
	rows, err := s.db.Query(query, Conversation_id, 10)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var msg_id int
		var conv_id int
		var sender_id int
		var data string
		var sendAt time.Time

		err := rows.Scan(&msg_id, &conv_id, &sender_id, &data, &sendAt)
		if err != nil {
			return nil, err
		}

		oso := DataFromTheUserAPI{
			Text: data,
		}
		mes := newMessage(msgChat, sender_id, -1, oso)
		bunchOfMessages = append(bunchOfMessages, mes)
	}

	defer rows.Close()
	return bunchOfMessages, nil
}
