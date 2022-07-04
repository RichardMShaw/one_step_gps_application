package routes

import (
	"fmt"
	"io/fs"
	"net/http"
	"strings"

	"github.com/RichardMShaw/one_step_gps_application/client"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func Router() http.Handler {
	mux := chi.NewMux()
	mux.Use(middleware.Recoverer)
	mux.HandleFunc("/", indexHandler)

	staticFS, _ := fs.Sub(client.StaticFiles, "dist")
	httpFS := http.FileServer(http.FS(staticFS))
	mux.Handle("/static/*", httpFS)

	deviceRoutes(mux)
	return mux
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintln(w, http.StatusText(http.StatusMethodNotAllowed))
		return
	}

	if strings.HasPrefix(r.URL.Path, "/api") {
		http.NotFound(w, r)
		return
	}

	if r.URL.Path == "/favicon.ico" {
		rawFile, _ := client.StaticFiles.ReadFile("dist/favicon.ico")
		w.Write(rawFile)
		return
	}

	rawFile, _ := client.StaticFiles.ReadFile("dist/index.html")
	w.Write(rawFile)
}
