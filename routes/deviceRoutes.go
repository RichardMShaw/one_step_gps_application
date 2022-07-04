package routes

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
)

func deviceRoutes(mux *chi.Mux) {
	key := os.Getenv("ONE_STEP_GPS_KEY")
	deviceGetRoute := fmt.Sprintf("https://track.onestepgps.com/v3/api/public/device?latest_point=true&api-key=%s", key)
	mux.Get("/api/device", func(w http.ResponseWriter, r *http.Request) {
		res, err := http.Get(deviceGetRoute)
		if err != nil {
			log.Println(err)
			return
		}
		defer res.Body.Close()
		body, err := io.ReadAll(res.Body)
		if err != nil {
			log.Println(err)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(body)
	})
}
