package app_config

import (
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/mongo"
)

type AppConfig struct {
	Mux         *chi.Mux
	MongoClient *mongo.Client
}
