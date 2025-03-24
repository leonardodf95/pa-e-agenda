package user

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/leonardodf95/pa-e-agenda/config"
	"github.com/leonardodf95/pa-e-agenda/service/auth"
	"github.com/leonardodf95/pa-e-agenda/types"
	"github.com/leonardodf95/pa-e-agenda/utils"
)

type Handler struct {
	store types.UserStore
}

func NewHandler(store types.UserStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.handleLogin).Methods(http.MethodPost)
	router.HandleFunc("/register", h.handleRegister).Methods("POST")
	router.HandleFunc("/list", auth.WithJWTAuth(h.handleGetUsers, h.store)).Methods("GET")
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	//get JSON payload
	var payload types.LoginUserPayload
	err := utils.ParseJSON(r, &payload)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	//Validate PayLoad
	if err := utils.Validate.Struct(payload); err != nil {
		error := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", error))
		return
	}

	//check email
	u, err := h.store.GetUserByEmail(payload.Email)

	if err != nil {
		fmt.Printf("error getting user by email: %v", err)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid email or password"))
		return
	}

	if u.Status != "A" {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user is not active"))
		return
	}

	//check password
	if !auth.ComparePassword(u.Password, []byte(payload.Password)) {
		fmt.Printf("error comparing password: %v", err)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid email or password"))
		return
	}

	secret := []byte(config.Envs.JWTSecret)

	token, err := auth.CreateJWT(secret, *u)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string]string{"token": token})

}

func (h *Handler) handleRegister(w http.ResponseWriter, r *http.Request) {
	//get JSON payload
	var payload types.RegisterUserPayload
	err := utils.ParseJSON(r, &payload)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	//Validate PayLoad
	if err := utils.Validate.Struct(payload); err != nil {
		error := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", error))
		return
	}

	//check email
	_, err = h.store.GetUserByEmail(payload.Email)
	if err != nil && err.Error() != "user not found" {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	if err == nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user with email %s already exists", payload.Email))
		return
	}

	hashedPassword, err := auth.HashPassword(payload.Password)
	if err != nil {
		fmt.Printf("error hashing password: %v", err)
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	err = h.store.CreateUser(&types.RegisterUserPayload{
		Name:     payload.Name,
		Email:    payload.Email,
		Password: hashedPassword,
		Role:     payload.Role,
	})

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "user created"})
}

func (h *Handler) handleGetUsers(w http.ResponseWriter, r *http.Request) {

	var filters types.User

	queryParams := r.URL.Query()
	if err := utils.MapQueryParamsToStruct(queryParams, &filters); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid query parameters: %v", err))
		return
	}

	users, err := h.store.ListUsers(filters)
	if err != nil {
		log.Printf("error listing users: %v", err)
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, users)
}
