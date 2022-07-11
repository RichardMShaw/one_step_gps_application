package routes

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"time"

	"github.com/RichardMShaw/one_step_gps_application/packages/app_config"
	"github.com/RichardMShaw/one_step_gps_application/packages/models"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func deviceHeaderSettingRoutes(mux *chi.Mux, app *app_config.AppConfig) {
	client := app.MongoClient
	database := client.Database("onestepgps")
	collection := database.Collection("deviceheadersettings")

	mux.Get("/api/device-header-settings/{user_id}", func(w http.ResponseWriter, r *http.Request) {
		user_id, err := primitive.ObjectIDFromHex(chi.URLParam(r, "user_id"))
		if err != nil {
			http.Error(w, "Invalid User Id", http.StatusBadRequest)
			return
		}
		var item models.DeviceHeaderSettings
		ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
		err = collection.FindOne(ctx, bson.M{
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
			http.Error(w, "Failed to Read", http.StatusBadRequest)
			return
		}
		user_id, err := primitive.ObjectIDFromHex(f.UserID)
		if err != nil {
			http.Error(w, "Invalid User Id", http.StatusBadRequest)
			return
		}
		hidden_devices := f.HeaderSettings

		newItem := models.DeviceHeaderSettings{UserID: user_id, HeaderSettings: hidden_devices}

		ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

		var oldItem models.DeviceHeaderSettings
		err = collection.FindOneAndUpdate(ctx, bson.M{
			"user_id": user_id,
		}, bson.M{"$currentDate": bson.M{"updated_at": true}, "$set": newItem}).Decode(&oldItem)
		if err == mongo.ErrNoDocuments {
			newItem.CreatedAt = time.Now()
			newItem.UpdatedAt = newItem.CreatedAt
			collection.InsertOne(ctx, newItem)
		} else if err != nil {
			http.Error(w, "Failed to Save Data", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

}
