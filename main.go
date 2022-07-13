package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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

	port := os.Getenv("PORT")
	address := fmt.Sprintf(":%s", port)
	srv := &http.Server{
		Addr:    address,
		Handler: routes.Router(&app),
	}
	srv.ListenAndServe()
}
