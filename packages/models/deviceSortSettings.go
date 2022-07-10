package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DeviceSortSettings struct {
	ID        primitive.ObjectID  `json:"id" bson:"_id"`
	UserID    primitive.ObjectID  `json:"user_id" bson:"user_id"`
	SortBy    string              `json:"sort_by" bson:"sort_by"`
	SortDesc  bool                `json:"sort_desc" bson:"sort_desc"`
	CreatedAt primitive.Timestamp `json:"created_at" bson:"created_at"`
	UpdatedAt primitive.Timestamp `json:"updated_at" bson:"updated_at"`
}
