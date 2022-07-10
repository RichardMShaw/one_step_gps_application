package main

import (
	"log"
	"net/http"

	// "net/http"
	"github.com/RichardMShaw/one_step_gps_application/packages/app_config"
	"github.com/RichardMShaw/one_step_gps_application/packages/db"
	"github.com/RichardMShaw/one_step_gps_application/packages/routes"
	"github.com/joho/godotenv"
)

func main() {
	var app app_config.AppConfig

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	app.MongoClient = db.InitalizeConnection()
	srv := &http.Server{
		Addr:    "localhost:8000",
		Handler: routes.Router(&app),
	}
	srv.ListenAndServe()
}
