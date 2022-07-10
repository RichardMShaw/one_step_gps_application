package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type DeviceIcon struct {
	ID       primitive.ObjectID `json:"id" bson:"_id"`
	UserID   primitive.ObjectID `json:"user_id" bson:"user_id"`
	DeviceID string             `json:"device_id" bson:"device_id"`
	FileID   primitive.ObjectID `json:"file_id" bson:"file_id"`
}
