const mongoose = require('mongoose');
let Product = require('../models/product');

module.exports = {
    getAllProducts: (request, response) => {
        Product.find({}, function(err, docs) {
            if (err) throw err;
            console.log('Number of documents founded: ' + docs.length);
            response.json(docs).end();
        });
    },
    getProductById: (request, response) => {
        let id = mongoose.Types.ObjectId(request.swagger.params.productId.value);
        Product.findById(id, function (err, res) {
            if (err) {
                console.log(`err:\n ${JSON.stringify(err)}`);
                response.json(err).end();
                throw err;
            }
            let status = res ? 200 : 404;
            let result = res ? res : {message: `Document not found`};
            console.log(`result:\n ${JSON.stringify(result)}`);
            response.status(status).json(result).end();
        });
    },
    deleteProductById: (request, response) => {
        let id = mongoose.Types.ObjectId(request.swagger.params.productId.value);
        Product.findByIdAndRemove(id, function (err, res) {
            if (err) {
                response.json(err).end();
                throw err;
            }
            response.json(res ? res : {message: 'Document not found'}).end();
        });
    },
    addNewProduct: (request, response) => {
        let newProduct = new Product(request.swagger.params.body.value);

        let error = newProduct.validateSync();
        if (error) response.json({message: error}).end();
        else {
            newProduct.save(function (err, doc) {
                if (err) {
                    response.json(err).end();
                    throw err;
                }
                response.json(doc).end();
            });
        }
    }
};