var express = require('express');
var router = express.Router();
const AuthMiddleware = require("../middlewares/middleware");
const { MongoClient, ObjectId } = require("mongodb")
var url = "mongodb://localhost:27017/";

const client = new MongoClient(url)
client.connect()
const dbo = client.db("communication");
const collection = dbo.collection("users")

/* 
  Endpoint: GET /users
  Description: List of all users
*/
router.get('/', function (req, res, next) {
  collection.find({}).toArray(function (err, result) {
    if (err) throw err;
    res.send({
      endpoint: '/users',
      method: 'GET',
      description: "List of all users.",
      data: result
    });
  })
});

/* 
  Endpoint: POST /users/auth
  Description: User login
*/
router.post("/auth", [AuthMiddleware.verifyRequired], function (req, res, next) {
  collection.findOne({
    email: req.body.email,
    password: req.body.password
  },
    function (err, result) {
      console.log(result)
      if (result === null) {
        res.send({ status: "failed", data: null });
      }
      else {
        req.session.user = result
        res.send(
          {
            status: "success",
            session: req.session.user._id
          }
        );
      }
    }
  )
});

/* 
  Endpoint: GET /users/ObjectID
  Description: Get single user via ID
*/
router.get("/:id", [AuthMiddleware.verifyParams], function (req, res, next) {
  collection.findOne({
    _id: new ObjectId(req.params.id)
  },
    function (err, result) {
      if (err) throw err;
      res.send({
        endpoint: '/users/ObjectId',
        method: 'GET',
        description: "Get single user details via ID.",
        data: result
      });
    }
  )
});

/* 
  Endpoint: POST /users
  Description: Create user
*/
router.post("/", [AuthMiddleware.verifyRequired], function (req, res, next) {
  const insertObject = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }
  collection.insertOne(
    { ...insertObject },
    function (err, result) {
      if (err) throw err;
      res.send({
        endpoint: '/users',
        method: 'POST',
        description: "Create user.",
        data: {
          ...insertObject,
          _id: result.insertedId,
        }
      });
    }
  )
});


/* 
  Endpoint: PUT /users
  Description: Update user via ID
*/
router.put("/:id", [AuthMiddleware.verifyParams, AuthMiddleware.verifyRequired], function (req, res, next) {
  const updateObject = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
  }
  collection.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: { ...updateObject } },
    { upsert: true })
    .then(result =>
      res.send({
        endpoint: '/users',
        method: 'PUT',
        description: "Update user via ID.",
        data: {
          ...updateObject,
          _id: result.value._id
        }
      })
    )
});

/* 
  Endpoint: DELETE /users
  Description: Delete user via ID
*/
router.delete("/:id", [AuthMiddleware.verifyParams], function (req, res, next) {
  collection.deleteOne({
    _id: new ObjectId(req.params.id)
  },
    function (err, result) {
      if (err) throw err;
      res.send({
        endpoint: '/users',
        method: 'DELETE',
        description: "Delete user via ID.",
        data: {
          deletedUser: req.params.id,
          deletedCount: result.deletedCount
        }
      })
    }
  )
});

// Delete session
// router.get('/logout', (req, res) => {
//   req.session.destroy();
//   res.send('session deleted')
// });

module.exports = router;
