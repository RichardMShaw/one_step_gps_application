package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Used when saving or retreiving data from Mongo Cluster
type DeviceIcon struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	FileID    primitive.ObjectID `json:"file_id" bson:"file_id,omitempty"`
	DeviceID  string             `json:"device_id" bson:"device_id,omitempty"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at,omitempty"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at,omitempty"`
}
