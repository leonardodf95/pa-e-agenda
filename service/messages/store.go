package messages

import (
	"context"
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

func (s *Store) GetMessages(filter types.FilterMessageQuery) ([]types.Message, error) {
	sql := "SELECT m.id, m.sender_id, m.title, m.message, m.type, m.created_at, m.status FROM messages m join messages_destinations md ON md.message_id = m.id WHERE 1=1"
	args := []interface{}{}

	if filter.SenderID != 0 {
		sql += " AND sender_id = ?"
		args = append(args, filter.SenderID)
	}

	if filter.DestinationID != 0 {
		sql += " AND destination_id = ?"
		args = append(args, filter.DestinationID)
	}

	if filter.Title != "" {
		sql += " AND title = ?"
		args = append(args, filter.Title)
	}

	if filter.Message != "" {
		sql += " AND message = ?"
		args = append(args, filter.Message)
	}

	if filter.Type != "" {
		sql += " AND type = ?"
		args = append(args, filter.Type)
	}

	if filter.Readed {
		sql += " AND readed = ?"
		args = append(args, filter.Readed)
	}

	rows, err := s.db.Query(sql, args...)
	if err != nil {
		return nil, err
	}

	messages := make([]types.Message, 0)
	for rows.Next() {
		m, err := scanRowIntoMessage(rows)
		if err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}

	return messages, nil
}

func (s *Store) InsertMessage(ctx context.Context, m *types.Message) error {
	// Inicia uma transação
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("erro ao iniciar transação: %w", err)
	}
	defer tx.Rollback() // Rollback seguro se a transação falhar

	// Insere na tabela messages
	query := `
			INSERT INTO messages (
					sender_id, 
					title, 
					message, 
					type, 
					created_at, 
					status
			) VALUES (?, ?, ?, ?, ?, ?)
	`

	res, err := tx.ExecContext(
		ctx,
		query,
		m.SenderID,
		m.Title,
		m.Message,
		m.Type,
		m.CreatedAt,
		m.Status,
	)
	if err != nil {
		return fmt.Errorf("erro ao inserir mensagem: %w", err)
	}

	// Obtém o ID da mensagem inserida
	messageID, err := res.LastInsertId()
	if err != nil {
		return fmt.Errorf("erro ao obter ID da mensagem: %w", err)
	}
	m.ID = int(messageID)

	// Prepara statement para destinations
	stmt, err := tx.Prepare(`
			INSERT INTO messages_destinations (
					message_id, 
					destination_id,
					readed
			) VALUES (?, ?,?)
	`)
	if err != nil {
		return fmt.Errorf("erro ao preparar statement: %w", err)
	}
	defer stmt.Close()

	// Insere cada destino
	for i := range m.Destination {
		dest := &m.Destination[i]
		dest.MessageID = m.ID

		res, err := stmt.ExecContext(
			context.Background(),
			dest.MessageID,
			dest.DestinationID,
			dest.Readed,
		)
		if err != nil {
			return fmt.Errorf("erro ao inserir destino: %w", err)
		}

		// Atualiza ID do destino
		destID, err := res.LastInsertId()
		if err != nil {
			return fmt.Errorf("erro ao obter ID do destino: %w", err)
		}
		dest.ID = int(destID)
	}

	// Commit da transação
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("erro ao commitar transação: %w", err)
	}

	return nil
}

func scanRowIntoMessage(rows *sql.Rows) (types.Message, error) {
	var m types.Message
	err := rows.Scan(&m.ID, &m.SenderID, &m.Title, &m.Message, &m.Type, &m.CreatedAt, &m.Status)
	if err != nil {
		return types.Message{}, err
	}
	return m, nil
}
