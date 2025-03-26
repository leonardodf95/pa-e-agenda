package types

import (
	"context"
	"time"
)

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id int) (*User, error)
	ListUsers(filter User) ([]User, error)
	CreateUser(u *RegisterUserPayload) error
}

type RoleStore interface {
	GetRoles() ([]Role, error)
}

type MessageStore interface {
	GetMessages(filters FilterMessageQuery) ([]Message, error)
	InsertMessage(ctx context.Context, m *Message) error
}

type ContextKey string

type RegisterUserPayload struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6,max=20"`
	Role     int64  `json:"role"`
}

type LoginUserPayload struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type User struct {
	ID        int       `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"password" db:"password"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	Status    string    `json:"status" db:"status"`
	Role      int64     `json:"roles"`
	Token     string    `json:"token"`
}

type Role struct {
	ID        int       `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	Status    string    `json:"status" db:"status"`
}

type Message struct {
	ID          int                  `json:"id" db:"id"`
	SenderID    int                  `json:"sender_id" db:"sender_id"`
	Title       string               `json:"title" db:"title"`
	Message     string               `json:"message" db:"message"`
	Type        string               `json:"type" db:"type"`
	CreatedAt   time.Time            `json:"created_at" db:"created_at"`
	Status      string               `json:"status" db:"status"`
	Destination []MessageDestination `json:"destination"`
}

type MessageDestination struct {
	ID            int       `json:"id" db:"id"`
	MessageID     int       `json:"message_id" db:"message_id"`
	DestinationID int       `json:"destination_id" db:"destination_id"`
	Readed        bool      `json:"readed" db:"readed"`
	ReadedAt      time.Time `json:"readed_at" db:"readed_at"`
}

type RegisterMessagePayload struct {
	Title        string `json:"title" validate:"required"`
	Message      string `json:"message" validate:"required"`
	Type         string `json:"type" validate:"required"`
	Destinations []int  `json:"destinations" validate:"required"`
}

type FilterMessageQuery struct {
	ID            int    `json:"id"`
	SenderID      int    `json:"sender_id"`
	Title         string `json:"title"`
	Message       string `json:"message"`
	Type          string `json:"type"`
	CreatedAt     string `json:"created_at"`
	Status        string `json:"status"`
	DestinationID int    `json:"destination_id"`
	Readed        bool   `json:"readed"`
}
