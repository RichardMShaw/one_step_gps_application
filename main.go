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

	envPort := os.Getenv("PORT")
	fmt.Println(envPort)
	if len(envPort) == 0 {
		envPort = "localhost:8000"
	}
	srv := &http.Server{
		Addr:    envPort,
		Handler: routes.Router(&app),
	}
	srv.ListenAndServe()
}
