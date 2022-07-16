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
	//Struct to pass through routes for data management
	var app app_config.AppConfig

	//Retrieves data from .env for development
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}

	app.MongoClient, err = db.InitalizeConnection()
	if err != nil {
		log.Fatalf("Error : %s", err.Error())
	}

	port := os.Getenv("PORT")
	address := fmt.Sprintf(":%s", port)
	srv := &http.Server{
		Addr:    address,
		Handler: routes.Router(&app),
	}
	srv.ListenAndServe()
}
