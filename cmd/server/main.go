package main

import (
	"flag"
	"log"
	"net/http"
	"time"

	"github.com/ohowland/cgc_web/internal/server"
)

func main() {
	var dir string

	flag.StringVar(&dir, "dir", "./client/build/", "the directory to serve fles from. Defaults to the current dir")
	flag.Parse()

	app, err := server.New(dir)

	if err != nil {
		log.Fatal(err)
	}

	r := app.Router()

	srv := &http.Server{
		Handler:      r,
		Addr:         "127.0.0.1:8000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
