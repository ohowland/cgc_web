package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/*
type Adapter func(http.Handler) http.Handler

func Adapt(h http.Handler, adapters ...Adapter) http.Handler {
	for _, adapter := range adapters {
		h = adapter(h)
	}
	return h
}

func withDB(db *mongo)
*/

type App struct {
	baseDir string
	client  *mongo.Client
}

// New returns a new application server reference
func New(dir string) (*App, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		return &App{}, err
	}

	return &App{baseDir: dir, client: client}, nil
}

// Router returns a new http request router
func (a *App) Router() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/api/assetConfig", a.assetConfig).Methods("GET")

	r.PathPrefix("/").Handler(http.FileServer(http.Dir(a.baseDir)))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(a.baseDir))))

	return r
}

func (a *App) assetConfig(w http.ResponseWriter, r *http.Request) {
	ctx, _ := context.WithTimeout(context.Background(), 20*time.Second)
	err := a.client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer a.client.Disconnect(ctx)

	assetConfigCollection := a.client.Database("cgc_db").Collection("assetConfig")

	cur, err := assetConfigCollection.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	defer cur.Close(ctx)

	resp := bson.A{}
	for cur.Next(ctx) {
		var elem bson.M
		if err := cur.Decode(&elem); err != nil {
			log.Fatal(err)
		}
		resp = append(resp, elem)
	}

	json, err := json.Marshal(resp)
	if err != nil {
		log.Fatal(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}
