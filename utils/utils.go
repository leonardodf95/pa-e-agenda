package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	validator "github.com/go-playground/validator/v10"
)

var Validate = validator.New()

func ParseJSON(r *http.Request, v any) error {
	if r.Body == nil {
		return fmt.Errorf("request body is empty")
	}

	return json.NewDecoder(r.Body).Decode(v)
}

// MapQueryParamsToStruct maps query parameters to a struct using reflection.
func MapQueryParamsToStruct(queryParams map[string][]string, target interface{}) error {
	data := make(map[string]interface{})
	for key, values := range queryParams {
		if len(values) > 0 {
			data[key] = values[0]
		}
	}
	jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("error marshalling query params: %v", err)
	}
	if err := json.Unmarshal(jsonData, target); err != nil {
		return fmt.Errorf("error unmarshalling into struct: %v", err)
	}
	return nil
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func WriteError(w http.ResponseWriter, status int, err error) {
	WriteJSON(w, status, map[string]string{"error": err.Error()})
}

func ParseInt(s string) (int, error) {
	if s == "" {
		return 0, nil
	}
	return strconv.Atoi(s)
}

func GetCurrentTime() time.Time {
	return time.Now()
}
