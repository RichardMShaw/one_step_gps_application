package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Used when saving or retreiving data from Mongo Cluster
type DeviceSortSettings struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID    primitive.ObjectID `json:"user_id" bson:"user_id,omitempty"`
	SortBy    string             `json:"sort_by" bson:"sort_by,omitempty"`
	SortDesc  bool               `json:"sort_desc" bson:"sort_desc"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at,omitempty"`
}
