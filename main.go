package main

import (
	"net/http"

	"github.com/RichardMShaw/one_step_gps_application/routes"
)

func main() {
	srv := &http.Server{
		Addr:    ":8000",
		Handler: routes.Router(),
	}
	srv.ListenAndServe()
}

