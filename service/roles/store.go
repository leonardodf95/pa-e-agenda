package roles

import (
	"database/sql"

	"github.com/leonardodf95/pa-e-agenda/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db}
}

func (s *Store) GetRoles() ([]types.Role, error) {
	sql := "SELECT * FROM roles WHERE status = 'A';"
	rows, err := s.db.Query(sql)
	if err != nil {
		return nil, err
	}

	roles := []types.Role{}
	for rows.Next() {
		r := new(types.Role)
		err = rows.Scan(&r.ID, &r.Name, &r.CreatedAt, &r.Status)
		if err != nil {
			return nil, err
		}

		roles = append(roles, *r)
	}

	return roles, nil
}
