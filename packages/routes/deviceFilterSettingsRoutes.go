package routes

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/RichardMShaw/one_step_gps_application/packages/app_config"
	"github.com/RichardMShaw/one_step_gps_application/packages/models"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func deviceFilterSettingsRoutes(mux *chi.Mux, app *app_config.AppConfig) {
	client := app.MongoClient
	database := client.Database("onestepgps")
	collection := database.Collection("devicefiltersettings")

	//User ID is currently stored in an ENV value for the sake of proof of concept
	//Would be replaced with proper user authentication and management in further development
	user_id, _ := primitive.ObjectIDFromHex(os.Getenv("USER_ID"))

	mux.Get("/api/device-filter-settings", func(w http.ResponseWriter, r *http.Request) {
		var item models.DeviceFilterSettings
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		err := collection.FindOne(ctx, bson.M{
			"user_id": user_id,
		}).Decode(&item)

		if err == mongo.ErrNoDocuments {
			//If user has not saved HiddenSettings, then return drive_status "ALL"
			defaultItem, _ := json.Marshal(bson.M{"drive_status": "ALL"})
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write(defaultItem)
			return
		}

		jsonItem, err := json.Marshal(item)
		if err != nil {
			http.Error(w, "Failed to Marshal", http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonItem)
	})

	mux.Post("/api/device-filter-settings", func(w http.ResponseWriter, r *http.Request) {

		drive_status := r.FormValue("drive_status")

		newItem := models.DeviceFilterSettings{UserID: user_id, DriveStatus: drive_status}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var oldItem models.DeviceFilterSettings
		err := collection.FindOneAndUpdate(ctx, bson.M{
			"user_id": user_id,
		}, bson.M{"$currentDate": bson.M{"updated_at": true}, "$set": newItem}).Decode(&oldItem)
		if err == mongo.ErrNoDocuments {
			//Insert a new if not saved before
			newItem.CreatedAt = time.Now()
			newItem.UpdatedAt = newItem.CreatedAt
			_, err = collection.InsertOne(ctx, newItem)
			if err != nil {
				http.Error(w, "Failed to Insert Data", http.StatusInternalServerError)
				return
			}
		} else if err != nil {
			http.Error(w, "Failed to Save Data", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

}
