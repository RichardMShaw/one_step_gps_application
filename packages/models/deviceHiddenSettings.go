package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DeviceHiddenSettings struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID        primitive.ObjectID `json:"user_id" bson:"user_id,omitempty"`
	HiddenDevices map[string]bool    `json:"hidden_devices" bson:"hidden_devices,omitempty"`
	CreatedAt     time.Time          `json:"created_at" bson:"created_at,omitempty"`
	UpdatedAt     time.Time          `json:"updated_at" bson:"updated_at,omitempty"`
}

type DeviceHiddenSettingsFormData struct {
	UserID        string          `json:"user_id"`
	HiddenDevices map[string]bool `json:"hidden_devices"`
}
