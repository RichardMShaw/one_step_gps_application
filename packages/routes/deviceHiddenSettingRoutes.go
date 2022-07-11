package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
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

func deviceHiddenSettingRoutes(mux *chi.Mux, app *app_config.AppConfig) {
	client := app.MongoClient
	database := client.Database("onestepgps")
	collection := database.Collection("devicehiddensettings")
	user_id, _ := primitive.ObjectIDFromHex(os.Getenv("USER_ID"))

	mux.Get("/api/device-hidden-settings", func(w http.ResponseWriter, r *http.Request) {
		var item models.DeviceHiddenSettings
		ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
		err := collection.FindOne(ctx, bson.M{
			"user_id": user_id,
		}).Decode(&item)

		if err == mongo.ErrNoDocuments {
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

	mux.Post("/api/device-hidden-settings", func(w http.ResponseWriter, r *http.Request) {

		defer r.Body.Close()
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to Read", http.StatusBadRequest)
			return
		}
		var f models.DeviceHiddenSettingsFormData
		json.Unmarshal(body, &f)

		if err != nil {
			http.Error(w, "Failed to Read", http.StatusBadRequest)
			return
		}
		user_id, err := primitive.ObjectIDFromHex(f.UserID)
		if err != nil {
			http.Error(w, "Invalid User Id", http.StatusBadRequest)
			return
		}
		hidden_devices := f.HiddenDevices

		newItem := models.DeviceHiddenSettings{UserID: user_id, HiddenDevices: hidden_devices}

		ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

		var oldItem models.DeviceHiddenSettings
		err = collection.FindOneAndUpdate(ctx, bson.M{
			"user_id": user_id,
		}, bson.M{"$currentDate": bson.M{"updated_at": true}, "$set": newItem}).Decode(&oldItem)
		if err == mongo.ErrNoDocuments {
			newItem.CreatedAt = time.Now()
			newItem.UpdatedAt = newItem.CreatedAt
			collection.InsertOne(ctx, newItem)
		} else if err != nil {
			fmt.Println(err)
			http.Error(w, "Failed to Save Data", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

}
