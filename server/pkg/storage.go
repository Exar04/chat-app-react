package pkg

import (
	"database/sql"
	"fmt"
	"log"

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
}

type PostgresStore struct {
	db *sql.DB
}

func NewPostgresStore() (*PostgresStore, error) {
	connStr := "user=yash password=yash dbname=WebChats sslmode=disable"
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
	create table if not exists User(
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
		foregin key(user) references user(user_id),       
		foregin key(userFriend) references user(user_id),       
	)`
	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) CreateChatMessageTable() error {
	query := `
	create table if not exists ChatMessage(
		Message_id serial primary key,
		foregin key(Conversation_id) references conversations(conversation_id),       
		foregin key(Sender_id) references user(user_id),       
		Data            text,       
		SendAt          timestamp 
	)`
	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) CreateUserInDB(user *User) error {
	// we have to create new func newUser to make user and then use this function to add that user to the database
	query := fmt.Sprintf(`
	insert into User(username, password, email, createdAt)  
	values (%v, %v, %v, %v)
	`, user.UserName, user.Password, user.Email, user.CreatedAt)

	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) DeleteUserFromDB(*User) error {
	return nil
}

func (s *PostgresStore) GetUserById(user_id int) (*User, error) {
	var userFound User
	query := fmt.Sprintf(`
	select * from User
	where user_id=%v 
	`, user_id)

	err := s.db.QueryRow(query).Scan(&userFound)
	if err != nil {
		log.Fatal(err)
	}
	return &userFound, nil

}

func (s *PostgresStore) GetConversationId(user1_id, user2_id int) (int, error) {
	var conversation_id int
	query := fmt.Sprintf(`
		select conversation_id from Conversations
		where
		(user=%v AND userFriend=%v)
		OR
		(user=%v AND userFriend=%v)
	`, user1_id, user2_id, user2_id, user1_id)

	err := s.db.QueryRow(query).Scan(&conversation_id)
	if err != nil {
		return -1, err
	}
	return conversation_id, nil
}

func (s *PostgresStore) CheckUservalidityAndGetUser(username, password string) (*User, error) {
	var exists bool
	var TrueUser *User
	query1 := fmt.Sprintf(`
	select exists (select 1 from Users where username = %v)
	`, username)
	err := s.db.QueryRow(query1).Scan(&exists)
	if err != nil {
		log.Println("user Doesn't exist in database")
		return nil, err
	}
	if exists {
		query2 := fmt.Sprintf(`
		select password from Users where username = %v
		`, username)
		err := s.db.QueryRow(query2).Scan(&TrueUser)

		if err != nil {
			return nil, err
		}
		return TrueUser, nil
	}
	return nil, nil
}

func (s *PostgresStore) AddToFriendsList(user *User, friend *User) error {
	query := fmt.Sprintf(`
	insert into Conversations(user, userFriend)  
	values (%v, %v)
	`, user, friend)

	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) RemoveFriend(user *User, friend *User) error {

	return nil
}

// save recieved message in database
func (s *PostgresStore) SaveMessageInDB(message *DBChatMessage) error {

	query := fmt.Sprintf(`
	insert into ChatMessage(Conversation_id, Sender_id, Data, SendAt)  
	values (%v, %v, %v, %v)
	`, message.Conversation_id, message.Sender_id, message.Data, message.SendAt)
	_, err := s.db.Exec(query)

	return err
}
