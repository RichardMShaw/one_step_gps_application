package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DeviceHiddenSettings struct {
	ID            primitive.ObjectID  `json:"id" bson:"_id"`
	UserID        primitive.ObjectID  `json:"user_id" bson:"user_id"`
	HiddenDevices map[string]bool     `json:"hidden_devices" bson:"user_id"`
	CreatedAt     primitive.Timestamp `json:"created_at" bson:"created_at"`
	UpdatedAt     primitive.Timestamp `json:"updated_at" bson:"updated_at"`
}
