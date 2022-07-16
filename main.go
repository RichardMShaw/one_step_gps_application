package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/RichardMShaw/one_step_gps_application/packages/appConfig"
	"github.com/RichardMShaw/one_step_gps_application/packages/routes"
	"github.com/joho/godotenv"
)

func main() {
	//Retrieves data from .env for development
	err := godotenv.Load()
	if err != nil {
		//Error is acceptable in deployment
		log.Println("Error loading .env file")
	}

	//Struct to pass through routes for data management
	app := appConfig.NewAppConfig()
	repo := routes.NewRepo(app)

	port := os.Getenv("PORT")
	address := fmt.Sprintf(":%s", port)
	srv := &http.Server{
		Addr:    address,
		Handler: repo.Router(),
	}
	srv.ListenAndServe()
}
