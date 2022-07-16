package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/RichardMShaw/one_step_gps_application/packages/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func (repo *Repository) deviceHiddenSettingsRoutes() {
	app := repo.App
	mux := app.Mux
	client := app.MongoClient
	database := client.Database("onestepgps")
	collection := database.Collection("devicehiddensettings")

	//User ID is currently stored in an ENV value for the sake of proof of concept
	//Would be replaced with proper user authentication and management in further development
	user_id := app.DevUserID

	mux.Get("/api/device-hidden-settings", func(w http.ResponseWriter, r *http.Request) {
		var item models.DeviceHiddenSettings
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		err := collection.FindOne(ctx, bson.M{
			"user_id": user_id,
		}).Decode(&item)

		if err == mongo.ErrNoDocuments {
			//If user has not saved HiddenSettings, then return an empty map[string]bool
			defaultItem, _ := json.Marshal(bson.M{"hidden_devices": make(map[string]bool)})
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

	mux.Post("/api/device-hidden-settings", func(w http.ResponseWriter, r *http.Request) {

		defer r.Body.Close()
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to Read", http.StatusBadRequest)
			return
		}

		var f models.DeviceHiddenSettingsFormData
		err = json.Unmarshal(body, &f)

		if err != nil {
			http.Error(w, "Failed to Read", http.StatusBadRequest)
			return
		}

		hidden_devices := f.HiddenDevices

		newItem := models.DeviceHiddenSettings{UserID: user_id, HiddenDevices: hidden_devices}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var oldItem models.DeviceHiddenSettings
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
			fmt.Println(err)
			http.Error(w, "Failed to Save Data", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

}
