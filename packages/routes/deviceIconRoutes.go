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
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func deviceIconRoutes(mux *chi.Mux, app *app_config.AppConfig) {
	mux.Get("/api/device-icon/{device_id}/{user_id}", func(w http.ResponseWriter, r *http.Request) {
		var err error
		device_id := chi.URLParam(r, "device_id")
		user_id, _ := primitive.ObjectIDFromHex(chi.URLParam(r, "user_id"))

		client := app.MongoClient
		database := client.Database("onestepgps")
		collection := database.Collection("deviceicons")
		var item models.DeviceIcon
		ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
		err = collection.FindOne(ctx, bson.M{
			"device_id": device_id,
			"user_id":   user_id,
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
		var err error
		r.Body = http.MaxBytesReader(w, r.Body, 512*1024)
		file, handler, err := r.FormFile("icon")
		if err != nil {
			fmt.Println("Error Retrieving file from form-data")
			fmt.Println(err)
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

		client := app.MongoClient

		file_id := db.UploadFile(client, file, handler.Filename, "onestepgps")
		device_id := r.FormValue("device_id")
		user_id, _ := primitive.ObjectIDFromHex(r.FormValue("user_id"))

		deviceIcon := models.DeviceIcon{FileID: file_id, DeviceID: device_id, UserID: user_id}

		database := client.Database("onestepgps")
		collection := database.Collection("deviceicons")

		ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
		var item models.DeviceIcon
		err = collection.FindOneAndUpdate(ctx, bson.M{
			"device_id": device_id,
			"user_id":   user_id,
		}, bson.M{"$set": deviceIcon}).Decode(&item)
		if err == nil {
			db.DeleteFile(client, item.FileID, "onestepgps")
		} else {
			fmt.Println(deviceIcon)
			collection.InsertOne(ctx, deviceIcon)
		}
	})
}
