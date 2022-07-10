package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DeviceHeaderSettings struct {
	ID             primitive.ObjectID  `json:"id" bson:"_id"`
	UserID         primitive.ObjectID  `json:"user_id" bson:"user_id"`
	HeaderSettings map[string]bool     `json:"header_settings" bson:"header_settings"`
	CreatedAt      primitive.Timestamp `json:"created_at" bson:"created_at"`
	UpdatedAt      primitive.Timestamp `json:"updated_at" bson:"updated_at"`
}
