package app_config

import (
	"go.mongodb.org/mongo-driver/mongo"
)

//Struct to use in place of static variables without needing to use excessive imports
//Would get more use in a larger project
type AppConfig struct {
	MongoClient *mongo.Client
}
