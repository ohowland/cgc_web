package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var upgrader = websocket.Upgrader{}

type Message struct {
	Message string `json:"message"`
}

func main() {

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello")
	})

	e.GET("/ws", func(c echo.Context) error {
		upgrader.CheckOrigin = func(r *http.Request) bool { return true }

		ws, err := upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
		if err != nil {
			log.Println(err)
		}
		defer ws.Close()
		log.Println("Connected.")

		m := Message{"hi"}
		if err = ws.WriteJSON(m); err != nil {
			log.Printf("Websocket Write error: %v\n", err)
		}

		return nil
	})

	e.Logger.Fatal(e.Start(":1323"))
}
