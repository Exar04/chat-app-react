package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Exar04/chat-app-vue/server/pkg"
	"github.com/gorilla/websocket"
)

func main() {
	store, err := pkg.NewPostgresStore()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", store)
	if err := store.Init(); err != nil {
		log.Fatal(err)
	}

	api := &pkg.APIServer{
		ClientConnections: make(map[*websocket.Conn]struct{}),
		Store:             store,
	}

	http.HandleFunc("/websocket", api.SocketHandler)

	log.Println("Starting server on localhost:8088")
	if err := http.ListenAndServe(":8088", nil); err != nil {
		log.Fatal("Failed to start server:", err)
	}
	fmt.Println("hope this works!")
}

// func HandleWebConnection() {
// 	http.HandleFunc("/websocket", pkg.SocketHandler)

// 	log.Println("Starting server on localhost:8088")
// 	if err := http.ListenAndServe(":8088", nil); err != nil {
// 		log.Fatal("Failed to start server:", err)
// 	}
// }
