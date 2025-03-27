package firebasesdk

import (
	"context"
	"os"
	"path/filepath"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/messaging"
	"github.com/leonardodf95/pa-e-agenda/config"
	"github.com/leonardodf95/pa-e-agenda/types"
	"google.golang.org/api/option"
)

var PATH = config.Envs.FbCredentials

type PushNotification struct {
	Context         context.Context
	ClientMessaging *messaging.Client
	App             *firebase.App
}

func NewPushNotification() *PushNotification {
	app, ctx, client := SetupFirebase()
	return &PushNotification{
		App:             app,
		Context:         ctx,
		ClientMessaging: client,
	}
}

func (p *PushNotification) SendPushNotification(message types.PushNotificationMessage) error {
	// This is the message that will be sent to the device
	msg := &messaging.Message{
		Notification: &messaging.Notification{
			Title: message.Title,
			Body:  message.Body,
		},
		Topic: message.Topic,
	}

	// Send the message
	_, err := p.ClientMessaging.Send(p.Context, msg)
	if err != nil {
		return err
	}

	// Response is a message ID string.
	return nil
}

func SetupFirebase() (*firebase.App, context.Context, *messaging.Client) {

	ctx := context.Background()
	rootFolder, err := os.Getwd()
	if err != nil {
		panic("Unable to get current directory")
	}

	serviceAccountKeyFilePath, err := filepath.Abs(filepath.Join(rootFolder, PATH))
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
	client, err := app.Messaging(ctx)

	if err != nil {
		panic("Firebase messaging client error")
	}

	return app, ctx, client
}
