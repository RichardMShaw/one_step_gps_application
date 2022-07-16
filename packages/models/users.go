package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//Used when saving or retreiving data from Mongo Cluster
type User struct {
	ID        primitive.ObjectID  `json:"id" bson:"_id"`
	Email     string              `json:"email" bson:"email"`
	UserName  string              `json:"user_name" bson:"user_name"`
	Password  string              `json:"password" bson:"password"`
	CreatedAt primitive.Timestamp `json:"created_at" bson:"created_at"`
	UpdatedAt primitive.Timestamp `json:"updated_at" bson:"updated_at"`
}
