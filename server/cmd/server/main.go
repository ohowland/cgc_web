package main

import (
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/ohowland/cgc_web/server/internal/pkg/server"
)

func main() {
	var dir string
	var logging bool

	flag.StringVar(&dir, "dir", "../client/build/", "the directory to serve fles from. Defaults to the current dir")
	flag.BoolVar(&logging, "l", false, "enable logging")
	flag.Parse()

	if !logging {
		log.SetOutput(ioutil.Discard)
	}

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

	log.Println("Starting CGC Web Server")
	log.Fatal(srv.ListenAndServe())
}
