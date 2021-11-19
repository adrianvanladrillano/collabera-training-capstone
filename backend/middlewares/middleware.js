var mongodb = require("mongodb")

exports.verifyRequired = (req, res, next) => {
    // Check if the req.body is present
    if (Object.keys(req.body).length === 0) {
        return res.status(500).send({ error: 500, message: 'All field are required' });
    }
    next();
};
exports.verifyParams = (req, res, next) => {
    // Check if the req.params.id is a mongoDB ObjectId
    if (mongodb.ObjectId.isValid(req.params.id) == false) {
        return res.status(500).send({ middleware: 'verifyParams', message: 'ObjectId improper format' });
    }
    next();
};