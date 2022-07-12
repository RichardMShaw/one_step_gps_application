package db

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"log"
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

func InitalizeConnection() *mongo.Client {
	var err error
	var client *mongo.Client
	uri := os.Getenv("MONGODB_URI")
	opts := options.Client()
	opts.ApplyURI(uri)
	opts.SetMaxPoolSize(5)
	if client, err = mongo.Connect(context.Background(), opts); err != nil {
		fmt.Println(err.Error())
	}
	return client
}

func DeleteFile(conn *mongo.Client, file_id primitive.ObjectID, database string) {
	bucket, err := gridfs.NewBucket(
		conn.Database(database),
	)
	if err != nil {
		log.Fatal(err)
	}
	bucket.Delete(file_id)
}

func UploadFile(conn *mongo.Client, file multipart.File, filename string, database string) primitive.ObjectID {
	data, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatal(err)
	}
	bucket, err := gridfs.NewBucket(
		conn.Database(database),
	)
	if err != nil {
		log.Fatal(err)
	}
	uploadStream, err := bucket.OpenUploadStream(
		filename,
	)
	if err != nil {
		log.Fatal(err)
	}
	defer uploadStream.Close()
	uploadStream.Write(data)
	fileId := uploadStream.FileID.(primitive.ObjectID)
	return fileId
}

func DownloadFile(w http.ResponseWriter, conn *mongo.Client, file_id primitive.ObjectID, database string) {
	db := conn.Database(database)
	fsFiles := db.Collection("fs.files")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var results bson.M
	err := fsFiles.FindOne(ctx, bson.M{
		"_id": file_id,
	}).Decode(&results)
	if err != nil {
		log.Fatal(err)
	}
	bucket, _ := gridfs.NewBucket(db)

	var buf bytes.Buffer
	_, err = bucket.DownloadToStream(file_id, &buf)
	if err != nil {
		log.Fatal(err)
	}
	w.WriteHeader(http.StatusOK)
	w.Write(buf.Bytes())
}
