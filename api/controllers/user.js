
const mongoose = require('mongoose');
let User = require('../models/user');

module.exports = {
    getAllUsers: (request, response) => {
        User.find({}, function(err, docs) {
            if (err) throw err;
            console.log('Number of documents founded: ' + docs.length);
            response.json(docs).end();
        });
    },
    deleteUserById: (request, response) => {
        let id = mongoose.Types.ObjectId(request.swagger.params.userId.value);
        User.findByIdAndRemove(id, function (err, res) {
            if (err) {
                response.json(err).end();
                throw err;
            }
            response.json(res ? res : {message: 'Document not found'}).end();
        });
    }
};