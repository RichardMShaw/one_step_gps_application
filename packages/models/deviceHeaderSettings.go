package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Used when saving or retreiving data from Mongo Cluster
type DeviceHeaderSettings struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID         primitive.ObjectID `json:"user_id" bson:"user_id,omitempty"`
	HeaderSettings map[string]bool    `json:"header_settings" bson:"header_settings,omitempty"`
	CreatedAt      time.Time          `json:"created_at" bson:"created_at,omitempty"`
	UpdatedAt      time.Time          `json:"updated_at" bson:"updated_at,omitempty"`
}

//Seperate struct for processing FormData due to map[string]bool
type DeviceHeaderSettingsFormData struct {
	UserID         string          `json:"user_id"`
	HeaderSettings map[string]bool `json:"header_settings"`
}
