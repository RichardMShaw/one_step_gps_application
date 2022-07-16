package db

import (
	"bytes"
	"context"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//Initalizes and returns a connection to a mongo cluster
func InitalizeConnection() (*mongo.Client, error) {
	uri := os.Getenv("MONGODB_URI")
	opts := options.Client()
	opts.ApplyURI(uri)
	opts.SetMaxPoolSize(5)
	client, err := mongo.Connect(context.Background(), opts)
	if err != nil {
		return nil, err
	}
	return client, nil
}

//Deletes a file using the File ID
func DeleteFile(conn *mongo.Client, file_id primitive.ObjectID, database string) error {
	bucket, err := gridfs.NewBucket(
		conn.Database(database),
	)
	if err != nil {
		return err
	}
	err = bucket.Delete(file_id)
	if err != nil {
		return err
	}
	return nil
}

//Uploads a file to the mongo cluster and returns the File ID associated with it
func UploadFile(conn *mongo.Client, file multipart.File, filename string, database string) (primitive.ObjectID, error) {
	data, err := ioutil.ReadAll(file)
	if err != nil {
		return primitive.NilObjectID, err
	}
	bucket, err := gridfs.NewBucket(
		conn.Database(database),
	)
	if err != nil {
		return primitive.NilObjectID, err
	}
	uploadStream, err := bucket.OpenUploadStream(
		filename,
	)
	if err != nil {
		return primitive.NilObjectID, err
	}
	defer uploadStream.Close()
	_, err = uploadStream.Write(data)
	if err != nil {
		return primitive.NilObjectID, err
	}
	fileId := uploadStream.FileID.(primitive.ObjectID)
	return fileId, nil
}

//Downloads a file from the mongo cluster and returns the bytes
func DownloadFile(w http.ResponseWriter, conn *mongo.Client, file_id primitive.ObjectID, database string) ([]byte, error) {
	db := conn.Database(database)
	fsFiles := db.Collection("fs.files")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var results bson.M
	err := fsFiles.FindOne(ctx, bson.M{
		"_id": file_id,
	}).Decode(&results)
	if err != nil {
		return nil, err
	}
	bucket, err := gridfs.NewBucket(db)
	if err != nil {
		return nil, err
	}
	var buf bytes.Buffer
	_, err = bucket.DownloadToStream(file_id, &buf)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}
