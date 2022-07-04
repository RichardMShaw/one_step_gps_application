package main

import (
	"log"
	"net/http"

	"github.com/RichardMShaw/one_step_gps_application/routes"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
  if err != nil {
    log.Fatal("Error loading .env file")
  }
	
	srv := &http.Server{
		Addr:    ":8000",
		Handler: routes.Router(),
	}
	srv.ListenAndServe()
}

