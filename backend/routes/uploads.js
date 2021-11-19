var express = require('express');
var formidable = require('formidable');
const AuthMiddleware = require("../middlewares/middleware");
const fs = require('fs');
// const path = require('path');
var router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
var url = "mongodb://localhost:27017/";

const client = new MongoClient(url)
client.connect()
const dbo = client.db("communication");
const collection = dbo.collection("uploads")

/* 
  Endpoint: GET /uploads
  Description: List of all uploads
*/
router.get('/', function (req, res, next) {
    collection.find({}).toArray(function (err, result) {
        if (err) throw err;
        res.send({
            endpoint: '/uploads',
            method: 'GET',
            description: "List of all uploads.",
            data: result
        });
    })
});

/* 
  Endpoint: GET /uploads/ObjectID
  Description: Get single upload detail via ID
*/
router.get("/:id", [AuthMiddleware.verifyParams], function (req, res, next) {
    collection.findOne({
        _id: new ObjectId(req.params.id)
    },
        function (err, result) {
            if (err) throw err;
            res.send({
                endpoint: '/uploads/ObjectID',
                method: 'GET',
                description: "Get single upload details via ID",
                data: result
            });
        }
    )
});

/* 
  Endpoint: POST /uploads/files
  Description: Upload file
*/
router.post("/files", function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();//prints expected format.;
        const file_id = Number(new Date()) + "_" + date
        const getExtension = files.file.originalFilename.split('.').pop();

        var oldpath = files.file.filepath;
        var newpath = `uploads/${file_id}.${getExtension}`;

        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.send({ file_uploaded: `${file_id}.${getExtension}` });
        });
    });
});

/* 
  Endpoint: POST /uploads
  Description: Create Upload
*/
router.post("/", [AuthMiddleware.verifyRequired], function (req, res, next) {
    const insertObject = {
        id: req.body.id,
        filename: req.body.filename,
        label: req.body.label,
        parent: req.body.parent,
        shared: null
    }
    collection.insertOne(
        { ...insertObject },
        function (err, result) {
            if (err) throw err;
            res.send({
                endpoint: '/uploads',
                method: 'POST',
                description: "Create upload",
                data: {
                    ...insertObject,
                    _id: result.insertedId,
                }
            });
        }
    )
});

/* 
  Endpoint: POST /ObjectID&filename
  Description: Delete Upload
*/
router.delete("/:id&:filename", function (req, res, next) {
    if (fs.existsSync(`uploads/${req.params.filename}`)) {
        fs.unlinkSync(`uploads/${req.params.filename}`);
    }
    collection.deleteOne(
        {
            _id: new ObjectId(req.params.id)
        }, function (err, result) {
            if (err) throw err;
            res.send({
                endpoint: '/uploads',
                method: 'DELETE',
                description: "Delete upload via ID",
                data: {
                    ...result,
                    deleted_id: req.params.id
                }
            });
        }
    )
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

/* 
  Endpoint: PUT /uploads/ObjectID
  Description: Update upload via ID
*/
router.put("/:id", [AuthMiddleware.verifyRequired, AuthMiddleware.verifyParams], function (req, res, next) {
    const updateObject = {
        id: req.body.id,
        filename: req.body.filename,
        label: req.body.label,
        parent: req.body.parent,
        shared: req.body.shared
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
        endpoint: '/uploads',
        method: 'PUT',
        description: "Update upload via ID",
        data: {
            ...updateObject,
            _id: result.value._id
        }
    }))
});

module.exports = router;
