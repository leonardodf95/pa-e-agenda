package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/go-sql-driver/mysql"
	"github.com/leonardodf95/pa-e-agenda/cmd/api"
	"github.com/leonardodf95/pa-e-agenda/config"
	"github.com/leonardodf95/pa-e-agenda/db"
)

func main() {
	db, err := db.NewMySQLStorage(mysql.Config{
		User:                 config.Envs.DBUser,
		Passwd:               config.Envs.DBPass,
		Addr:                 config.Envs.DBAddr,
		DBName:               config.Envs.DBName,
		Net:                  "tcp",
		AllowNativePasswords: true,
		ParseTime:            true,
	})

	if err != nil {
		log.Fatal(err)
	}

	initStorage(db)

	server := api.NewApiServer(fmt.Sprintf(":%s", config.Envs.Port), db)
	if err := server.Start(); err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}

func initStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		log.Fatalf("could not ping database: %v", err)
	}

	log.Println("Connected to database")
}
