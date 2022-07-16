package appConfig

import (
	"log"
	"os"

	"github.com/RichardMShaw/one_step_gps_application/packages/db"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

//Struct to use in place of static variables without needing to use excessive imports
//Would get more use in a larger project
type AppConfig struct {
	MongoClient *mongo.Client
	Mux         *chi.Mux
	APIKeys     map[string]string
	APIRoutes   map[string]string
	DevUserID   primitive.ObjectID
}

func getAPIKeys() map[string]string {
	apiKeys := make(map[string]string)
	apiKeys["ONE_STEP_GPS_KEY"] = os.Getenv("ONE_STEP_GPS_KEY")
	return apiKeys
}

func getAPIRoutes() map[string]string {
	apiRoutes := make(map[string]string)
	apiRoutes["getOneStepGPSDeviceLatestPoint"] = "https://track.onestepgps.com/v3/api/public/device?latest_point=true"
	return apiRoutes
}

func NewAppConfig() *AppConfig {
	mongoClient, err := db.InitalizeConnection()
	if err != nil {
		log.Fatalf("Error : %s", err.Error())
	}

	devUserID, err := primitive.ObjectIDFromHex(os.Getenv("USER_ID"))
	if err != nil {
		log.Fatalf("Error : %s", err.Error())
	}
	return &AppConfig{
		MongoClient: mongoClient,
		Mux:         chi.NewMux(),
		APIKeys:     getAPIKeys(),
		APIRoutes:   getAPIRoutes(),
		DevUserID:   devUserID,
	}
}
