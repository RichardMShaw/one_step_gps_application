package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type DeviceIcon struct {
	ID       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID   primitive.ObjectID `json:"user_id" bson:"user_id,omitempty"`
	DeviceID string             `json:"device_id" bson:"device_id,omitempty"`
	FileID   primitive.ObjectID `json:"file_id" bson:"file_id,omitempty"`
}
