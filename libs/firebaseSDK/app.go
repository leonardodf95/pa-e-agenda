package firebasesdk

import (
	"context"
	"path/filepath"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/messaging"
	"github.com/leonardodf95/pa-e-agenda/config"
	"google.golang.org/api/option"
)

var PATH = config.Envs.FbCredentials

func SetupFirebase() (*firebase.App, context.Context, *messaging.Client) {

	ctx := context.Background()

	serviceAccountKeyFilePath, err := filepath.Abs(PATH)
	if err != nil {
		panic("Unable to load serviceAccountKeys.json file")
	}

	opt := option.WithCredentialsFile(serviceAccountKeyFilePath)

	//Firebase admin SDK initialization
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		panic("Firebase load error")
	}

	//Messaging client
	client, _ := app.Messaging(ctx)

	return app, ctx, client
}
