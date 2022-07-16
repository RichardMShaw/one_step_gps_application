package routes

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"time"

	"github.com/RichardMShaw/one_step_gps_application/packages/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func (repo *Repository) deviceHeaderSettingsRoutes() {
	app := repo.App
	mux := app.Mux
	client := app.MongoClient
	database := client.Database("onestepgps")
	collection := database.Collection("deviceheadersettings")

	//User ID is currently stored in an ENV value for the sake of proof of concept
	//Would be replaced with proper user authentication and management in further development
	user_id := app.DevUserID

	mux.Get("/api/device-header-settings", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var item models.DeviceHeaderSettings
		err := collection.FindOne(ctx, bson.M{
			"user_id": user_id,
		}).Decode(&item)

		if err == mongo.ErrNoDocuments {
			//If user has not saved HiddenSettings, then return nothing
			w.WriteHeader(http.StatusNoContent)
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

	mux.Post("/api/device-header-settings", func(w http.ResponseWriter, r *http.Request) {

		defer r.Body.Close()
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to Read", http.StatusBadRequest)
			return
		}

		var f models.DeviceHeaderSettingsFormData
		json.Unmarshal(body, &f)

		if err != nil {
			http.Error(w, "Failed to Unmarshal", http.StatusBadRequest)
			return
		}
		header_settings := f.HeaderSettings

		newItem := models.DeviceHeaderSettings{UserID: user_id, HeaderSettings: header_settings}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var oldItem models.DeviceHeaderSettings
		err = collection.FindOneAndUpdate(ctx, bson.M{
			"user_id": user_id,
		}, bson.M{"$currentDate": bson.M{"updated_at": true}, "$set": newItem}).Decode(&oldItem)
		if err == mongo.ErrNoDocuments {
			//Insert new data if not saved before
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
