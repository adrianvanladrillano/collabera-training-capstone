var express = require('express');
var router = express.Router();

const { MongoClient, ObjectId } = require("mongodb")
var url = "mongodb://localhost:27017/";

const client = new MongoClient(url)
client.connect()
// Database name
const dbo = client.db("communication");

// Table name
const collection = dbo.collection("chats");

// Get all Uploads
router.get('/', function (req, res, next) {
    collection.find({}).toArray(function (err, result) {
        if (err) throw err;
        res.send({ message: "Welcome to chats route", data: result });
    })
});

// Get all Uploads
router.get('/:id', function (req, res, next) {
    collection.find({
        _id: new ObjectId(req.params.id)
    }).toArray(function (err, result) {
        if (err) throw err;
        res.send({ message: "Welcome to chats route", data: result });
    })
});

router.delete("/delete/all", function (req, res, next) {
    collection.deleteMany({},
        function (err, result) {
            if (err) throw err;
            res.send({
                message: "Welcome to DELETE uploads route",
            });
        }
    )
});

// Delete single chat
router.delete("/:id", function (req, res, next) {
    collection.deleteOne({
        _id: new ObjectId(req.params.id)
    },
        function (err, result) {
            if (err) throw err;
            res.send({
                message: "Welcome to DELETE chats route",
                data: { ...result, deleted_id: req.params.id }
            });
        }
    )
});

// Create user
router.post("/", function (req, res, next) {
    const insertObject = {
        id: req.body.id,
        message: req.body.message,
        timestamp: req.body.timestamp,
        from: req.body.from,
    }
    collection.insertOne(
        { ...insertObject },
        function (err, result) {
            if (err) throw err;
            res.send({ message: "Welcome to POST uploads route", data: { ...insertObject, _id: result.insertedId, } });
        }
    )
});
// Update single upload
router.put("/:id", function (req, res, next) {
    const updateObject = {
        id: req.body.id,
        message: req.body.message,
        timestamp: req.body.timestamp,
        from: req.body.from,
    }
    collection.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        {
            $set: {
                ...updateObject
            }
        }, {
        upsert: true
    }).then(result => res.send({
        message: "Welcome to UPDATE chats route",
        data: { ...updateObject, _id: result.value._id }
    }))
});
module.exports = router;
