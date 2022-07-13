package app_config

import (
	"go.mongodb.org/mongo-driver/mongo"
)

type AppConfig struct {
	MongoClient *mongo.Client
}
