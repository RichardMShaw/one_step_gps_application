package routes

import (
	"io/fs"
	"net/http"
	"strings"

	"github.com/RichardMShaw/one_step_gps_application/client"
	"github.com/RichardMShaw/one_step_gps_application/packages/appConfig"
	"github.com/go-chi/chi/v5/middleware"
)

type Repository struct {
	App *appConfig.AppConfig
}

func NewRepo(app *appConfig.AppConfig) *Repository {
	return &Repository{
		App: app,
	}
}

func (repo *Repository) Router() http.Handler {
	mux := repo.App.Mux
	mux.Use(middleware.Recoverer)
	mux.HandleFunc("/*", indexHandler)

	staticFS, _ := fs.Sub(client.StaticFiles, "dist")
	httpFS := http.FileServer(http.FS(staticFS))
	mux.Handle("/static/*", httpFS)

	//Routes are divided into their own files to handle their own routing and functionality
	repo.deviceRoutes()
	repo.deviceIconRoutes()
	repo.deviceSortSettingsRoutes()
	repo.deviceFilterSettingsRoutes()
	repo.deviceHiddenSettingsRoutes()
	repo.deviceHeaderSettingsRoutes()
	return mux

}

//Serves Front-End
func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
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
