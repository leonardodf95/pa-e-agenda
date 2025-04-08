package api

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	firebasesdk "github.com/leonardodf95/pa-e-agenda/libs/firebaseSDK"
	"github.com/leonardodf95/pa-e-agenda/service/messages"
	"github.com/leonardodf95/pa-e-agenda/service/roles"
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
	routes.Use(enableCORS)
	subrouter := routes.PathPrefix("/api/v1").Subrouter()

	subrouter.Use(s.logRequest)
	notifier := firebasesdk.NewPushNotification()

	userStore := user.NewStore(s.db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	rolesStore := roles.NewStore(s.db)
	rolesHandler := roles.NewHandler(rolesStore)
	rolesHandler.RegisterRoutes(subrouter)

	messageStore := messages.NewStore(s.db)
	messageHandler := messages.NewHandler(messageStore, notifier)
	messageHandler.RegisterRoutes(subrouter)

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

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Set CORS headers for the response
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")

		// If this is a preflight OPTIONS request, end here.
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent) // or http.StatusOK
			return
		}

		// Continue to the next handler if not an OPTIONS request
		next.ServeHTTP(w, r)
	})
}
