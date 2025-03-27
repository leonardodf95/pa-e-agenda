package user

import (
	"database/sql"
	"fmt"

	"github.com/leonardodf95/pa-e-agenda/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db}
}

func (s *Store) GetUserByEmail(email string) (*types.User, error) {
	sql := "SELECT u.*, ur.role_id as role FROM users u LEFT JOIN user_roles ur ON ur.user_id =u.id  WHERE u.email = ? AND u.status = 'A';"
	rows, err := s.db.Query(sql, email)
	if err != nil {
		return nil, err
	}

	u := new(types.User)
	for rows.Next() {
		u, err = scanRowIntoUser(rows)
		if err != nil {
			return nil, err
		}
	}

	if u.ID == 0 {
		return nil, fmt.Errorf("user not found")
	}

	return u, nil
}

func (s *Store) CreateUser(u *types.RegisterUserPayload) error {
	res, err := s.db.Exec("INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, ?);", u.Name, u.Email, u.Password, "A")
	if err != nil {
		return err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return err
	}

	if u.Role != 0 {
		_, err = s.db.Exec("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", id, u.Role)
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *Store) GetUserByID(id int) (*types.User, error) {
	rows, err := s.db.Query("SELECT * FROM users WHERE id = ?", id)
	if err != nil {
		return nil, err
	}

	u := new(types.User)
	for rows.Next() {
		u, err = scanRowIntoUser(rows)
		if err != nil {
			return nil, err
		}
	}

	if u.ID == 0 {
		return nil, fmt.Errorf("user not found")
	}

	return u, nil
}

func (s *Store) ListUsers(filters types.User) ([]types.User, error) {
	sql := "SELECT u.id,u.name,u.email,u.created_at,u.status, ur.role_id FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE 1 = 1"
	parameters := []any{}

	if filters.Name != "" {
		sql += " AND u.name LIKE ?"
		parameters = append(parameters, filters.Name)
	}

	if filters.Email != "" {
		sql += " AND u.email LIKE ?"
		parameters = append(parameters, filters.Email)
	}

	if filters.Status != "" {
		sql += " AND u.status = ?"
		parameters = append(parameters, filters.Status)
	}

	if filters.Role != nil && *filters.Role != 0 {
		sql += " AND ur.role_id = ?"
		parameters = append(parameters, *filters.Role)
	}

	rows, err := s.db.Query(sql, parameters...)

	if err != nil {
		return nil, err
	}

	users, err := scanRowIntoUsers(rows)

	if err != nil {
		return nil, err
	}

	return users, nil
}

func scanRowIntoUser(row *sql.Rows) (*types.User, error) {
	u := new(types.User)
	err := row.Scan(&u.ID, &u.Name, &u.Email, &u.Password, &u.CreatedAt, &u.Status, &u.Token, &u.Role)
	if err != nil {
		return nil, err
	}
	return u, nil
}

func scanRowIntoUsers(rows *sql.Rows) ([]types.User, error) {
	users := []types.User{}
	for rows.Next() {
		u := new(types.User)
		err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt, &u.Status, &u.Role)
		if err != nil {
			return nil, err
		}
		users = append(users, *u)
	}
	return users, nil
}
