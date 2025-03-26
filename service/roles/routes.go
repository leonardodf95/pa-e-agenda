package roles

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/leonardodf95/pa-e-agenda/service/auth"
	"github.com/leonardodf95/pa-e-agenda/types"
	"github.com/leonardodf95/pa-e-agenda/utils"
)

type Handler struct {
	store types.RoleStore
}

func NewHandler(store types.RoleStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/list", auth.WithJWTAuth(h.handleListRoles)).Methods("GET")
}

func (h *Handler) handleListRoles(w http.ResponseWriter, r *http.Request) {
	roles, err := h.store.GetRoles()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSON(w, http.StatusOK, roles)
}
