package routes

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

func (repo *Repository) deviceRoutes() {
	app := repo.App
	mux := app.Mux
	key := app.APIKeys["ONE_STEP_GPS_KEY"]
	client := &http.Client{}
	req, err := http.NewRequest(http.MethodGet, app.APIRoutes["getOneStepGPSDeviceLatestPoint"], nil)
	if err != nil {
		log.Fatalf("Error : %s", err.Error())
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", key))

	mux.Get("/api/device", func(w http.ResponseWriter, r *http.Request) {
		res, err := client.Do(req)
		if err != nil {
			http.Error(w, "Failed to Fetch Devices from API", http.StatusBadGateway)
			return
		}
		defer res.Body.Close()
		body, err := io.ReadAll(res.Body)
		if err != nil {
			http.Error(w, "Failed to Prase Devices from API", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(body)
	})
}
