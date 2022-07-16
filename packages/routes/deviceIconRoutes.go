package routes

import (
	"context"
	"net/http"
	"path/filepath"
	"time"

	"github.com/RichardMShaw/one_step_gps_application/packages/db"
	"github.com/RichardMShaw/one_step_gps_application/packages/models"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func (repo *Repository) deviceIconRoutes() {
	app := repo.App
	mux := app.Mux
	client := repo.App.MongoClient
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

		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNoContent)
			return
		} else if err != nil {
			http.Error(w, "Failed to Decode Device", http.StatusInternalServerError)
			return
		}

		file, err := db.DownloadFile(w, client, item.FileID, "onestepgps")
		if err != nil {
			http.Error(w, "Failed to Download Icon", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(file)
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

		file_id, err := db.UploadFile(client, file, handler.Filename, "onestepgps")
		if err != nil {
			http.Error(w, "Failed to Upload Icon", http.StatusInternalServerError)
			return
		}
		device_id := r.FormValue("device_id")

		newItem := models.DeviceIcon{FileID: file_id, DeviceID: device_id}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var oldItem models.DeviceIcon
		err = collection.FindOneAndUpdate(ctx, bson.M{
			"device_id": device_id,
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
		err = db.DeleteFile(client, oldItem.FileID, "onestepgps")
		if err != nil {
			http.Error(w, "Failed to Delete Previous Icon", http.StatusInternalServerError)
			return
		}
	})
}
