package routes

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"time"

	"github.com/RichardMShaw/one_step_gps_application/packages/app_config"
	"github.com/RichardMShaw/one_step_gps_application/packages/db"
	"github.com/RichardMShaw/one_step_gps_application/packages/models"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func deviceIconRoutes(mux *chi.Mux, app *app_config.AppConfig) {
	client := app.MongoClient
	database := client.Database("onestepgps")
	collection := database.Collection("deviceicons")

	mux.Get("/api/device-icon/{device_id}", func(w http.ResponseWriter, r *http.Request) {
		device_id := chi.URLParam(r, "device_id")
		var item models.DeviceIcon
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		err := collection.FindOne(ctx, bson.M{
			"device_id": device_id,
		}).Decode(&item)
		if err != nil {
			fileBytes, err := ioutil.ReadFile("assets/placeholder.png")
			if err != nil {
				fmt.Println("Placeholder Icon Not Found.")
				return
			}
			w.Write(fileBytes)
			return
		}
		db.DownloadFile(w, client, item.FileID, "onestepgps")
	})

	mux.Post("/api/device-icon", func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, 512*1024)
		file, handler, err := r.FormFile("icon")
		if err != nil {
			http.Error(w, "Error Retrieving file from form-data", http.StatusBadRequest)
			return
		}
		defer file.Close()

		ext := filepath.Ext(handler.Filename)
		switch ext {

		case ".jpg":
			w.Header().Set("Content-Type", "image/jpeg")
		case ".jpeg":
			w.Header().Set("Content-Type", "image/jpeg")
		case ".png":
			w.Header().Set("Content-Type", "image/png")
		default:
			http.Error(w, "Invalid image type", http.StatusBadRequest)
			return
		}

		file_id := db.UploadFile(client, file, handler.Filename, "onestepgps")
		device_id := r.FormValue("device_id")

		newItem := models.DeviceIcon{FileID: file_id, DeviceID: device_id}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var oldItem models.DeviceIcon
		err = collection.FindOneAndUpdate(ctx, bson.M{
			"device_id": device_id,
		}, bson.M{"$currentDate": bson.M{"updated_at": true}, "$set": newItem}).Decode(&oldItem)

		if err == mongo.ErrNoDocuments {
			newItem.CreatedAt = time.Now()
			newItem.UpdatedAt = newItem.CreatedAt
			collection.InsertOne(ctx, newItem)
		} else if err != nil {
			http.Error(w, "Failed to Save Data", http.StatusInternalServerError)
			return
		}
		db.DeleteFile(client, oldItem.FileID, "onestepgps")
	})
}
