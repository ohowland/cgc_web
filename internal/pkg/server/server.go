package server

import (
	"context"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type App struct {
	baseDir string
	client  *mongo.Client
}

// New returns a new application server reference
func New(dir string) (*App, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		return App{}, err
	}

	return App{baseDir: dir, client: client}, nil
}

// Router returns a new http request router
func (a *App) Router() *mux.Router {
	r = mux.NewRouter()

	r.PathPrefix("/").Handler(http.FileServer(http.Dir(dir)))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(dir))))

	r.HandleFunc("/api/assetConfig", a.assetConfig).Methods("GET")

	return r
}

func (a *App) assetConfig(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.second)
	defer cancel()
	error := a.client.Connect(ctx)
	if err != nil {
		log.Println(err)
	}

	config := client.Database("cgc_db").Collection("assetConfig")

	w.WriteHeader(http.StatusOK)
	w.Write(config)
}
