package api

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/leonardodf95/pa-e-agenda/service/user"
)

type APIServer struct {
	addr string
	db   *sql.DB
}

func NewApiServer(addr string, db *sql.DB) *APIServer {
	return &APIServer{
		addr: addr,
		db:   db,
	}
}

func (s *APIServer) Start() error {
	routes := mux.NewRouter()
	subrouter := routes.PathPrefix("/api/v1").Subrouter()

	subrouter.Use(s.logRequest)

	userStore := user.NewStore(s.db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	routes.PathPrefix("/").Handler(http.FileServer(http.Dir("static")))

	log.Println("Starting server on", s.addr)

	return http.ListenAndServe(s.addr, routes)
}

func (s *APIServer) logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s", r.RemoteAddr, r.Method, r.URL)
		next.ServeHTTP(w, r)
	})
}
