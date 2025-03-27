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
