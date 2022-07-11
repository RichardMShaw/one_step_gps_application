package routes

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/RichardMShaw/one_step_gps_application/packages/app_config"
	"github.com/RichardMShaw/one_step_gps_application/packages/models"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func deviceSortSettingRoutes(mux *chi.Mux, app *app_config.AppConfig) {
	client := app.MongoClient
	database := client.Database("onestepgps")
	collection := database.Collection("devicesortsettings")
	user_id, _ := primitive.ObjectIDFromHex(os.Getenv("USER_ID"))

	mux.Get("/api/device-sort-settings", func(w http.ResponseWriter, r *http.Request) {

		var item models.DeviceSortSettings
		ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
		err := collection.FindOne(ctx, bson.M{
			"user_id": user_id,
		}).Decode(&item)

		if err != nil {
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

	mux.Post("/api/device-sort-settings", func(w http.ResponseWriter, r *http.Request) {
		sort_desc, err := strconv.ParseBool(r.FormValue("sort_desc"))
		if err != nil {
			http.Error(w, "Invalid Sort Desc", http.StatusBadRequest)
			return
		}

		sort_by := r.FormValue("sort_by")

		newItem := models.DeviceSortSettings{UserID: user_id, SortBy: sort_by, SortDesc: sort_desc}

		ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

		var oldItem models.DeviceSortSettings
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