package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Used when saving or retreiving data from Mongo Cluster
type DeviceFilterSettings struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID      primitive.ObjectID `json:"user_id" bson:"user_id,omitempty"`
	DriveStatus string             `json:"drive_status" bson:"drive_status,omitempty"`
	CreatedAt   time.Time          `json:"created_at" bson:"created_at,omitempty"`
	UpdatedAt   time.Time          `json:"updated_at" bson:"updated_at,omitempty"`
}
