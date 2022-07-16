package routes

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/RichardMShaw/one_step_gps_application/packages/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func (repo *Repository) deviceSortSettingsRoutes() {
	app := repo.App
	mux := app.Mux
	client := app.MongoClient
	database := client.Database("onestepgps")
	collection := database.Collection("devicesortsettings")

	//User ID is currently stored in an ENV value for the sake of proof of concept
	//Would be replaced with proper user authentication and management in further development
	user_id := app.DevUserID

	mux.Get("/api/device-sort-settings", func(w http.ResponseWriter, r *http.Request) {

		var item models.DeviceSortSettings
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		err := collection.FindOne(ctx, bson.M{
			"user_id": user_id,
		}).Decode(&item)

		if err != nil {
			//If user has not saved SortSettings, then return an empty sort_by and falsey sort_desc
			defaultItem, _ := json.Marshal(bson.M{"sort_by": "", "sort_desc": false})
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

	mux.Post("/api/device-sort-settings", func(w http.ResponseWriter, r *http.Request) {
		sort_desc, err := strconv.ParseBool(r.FormValue("sort_desc"))
		if err != nil {
			http.Error(w, "Invalid Sort Desc", http.StatusBadRequest)
			return
		}

		sort_by := r.FormValue("sort_by")

		newItem := models.DeviceSortSettings{UserID: user_id, SortBy: sort_by, SortDesc: sort_desc}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		var oldItem models.DeviceSortSettings
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
