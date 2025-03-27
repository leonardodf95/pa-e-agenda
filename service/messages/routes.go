package messages

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/leonardodf95/pa-e-agenda/service/auth"
	"github.com/leonardodf95/pa-e-agenda/types"
	"github.com/leonardodf95/pa-e-agenda/utils"
)

type Handler struct {
	store    types.MessageStore
	notifier types.PushNotification
}

func NewHandler(store types.MessageStore, notifier types.PushNotification) *Handler {
	return &Handler{store: store, notifier: notifier}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/list", auth.WithJWTAuth(h.handleListMessages)).Methods("GET")
	router.HandleFunc("/send", auth.WithJWTAuth(h.handleSendMessage)).Methods("POST")
}

func (h *Handler) handleListMessages(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	senderId, err := utils.ParseInt(query.Get("sender_id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid sender_id"))
		return
	}

	destinationId, err := utils.ParseInt(query.Get("destination_id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid destination_id"))
		return
	}

	filterMessages := types.FilterMessageQuery{
		SenderID:      senderId,
		Title:         query.Get("title"),
		Message:       query.Get("message"),
		Type:          query.Get("type"),
		DestinationID: destinationId,
		Readed:        query.Get("readed") == "true",
	}

	messages, err := h.store.GetMessages(filterMessages)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error getting messages: %v", err))
		return
	}

	utils.WriteJSON(w, http.StatusOK, messages)
}

func (h *Handler) handleSendMessage(w http.ResponseWriter, r *http.Request) {
	var payload types.RegisterMessagePayload
	err := utils.ParseJSON(r, &payload)

	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		error := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", error))
		return
	}

	ctx := r.Context()
	user := auth.GetUserFromContext(ctx)

	messageDestinations := make([]types.MessageDestination, 0)
	for _, destinationID := range payload.Destinations {
		messageDestinations = append(messageDestinations, types.MessageDestination{
			DestinationID: destinationID,
			Readed:        false,
		})
	}

	message := &types.Message{
		SenderID:    user.ID,
		Title:       payload.Title,
		Message:     payload.Message,
		Type:        payload.Type,
		Status:      "A",
		Destination: messageDestinations,
		CreatedAt:   utils.GetCurrentTime(),
	}

	err = h.store.InsertMessage(ctx, message)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("error inserting message: %v", err))
		return
	}

	go func() {
		h.sendPushNotifications(h.notifier, message)
	}()

	utils.WriteJSON(w, http.StatusCreated, message)
}

func (h *Handler) sendPushNotifications(notifier types.PushNotification, message *types.Message) error {
	for _, destination := range message.Destination {
		tokens, err := h.store.ListUsersTokens([]int{destination.DestinationID})
		if err != nil {
			return err
		}

		if len(tokens[destination.DestinationID]) == 0 {
			continue
		}

		for _, token := range tokens[destination.DestinationID] {
			pushMessage := types.PushNotificationMessage{
				Title: message.Title,
				Body:  message.Message,
				Topic: message.Type,
				Token: token,
			}

			err := notifier.SendPushNotification(pushMessage)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
