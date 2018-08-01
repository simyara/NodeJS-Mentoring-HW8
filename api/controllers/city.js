let mongoose = require('mongoose');

let City = require('../models/city');

module.exports = {
    getRandomCity: (request, response) => {
        City.random().then((city) => response.json(city).end());
    },
    getAllCities: (request, response) => {
        City.find({}, function(err, docs) {
            if (err)
                response.status(400).json({message: err});
            else {
                console.log('Number of documents founded: ' + docs.length);
                response.json(docs).end();
            }
        });
    },
    addNewCity: (request, response) => {
        let newCity = new City(request.swagger.params.body.value);

        let error = newCity.validateSync();
        if (error) {
            response.status(400).json({message: error.message}).end();
        }
        else {
            console.log(newCity);
            newCity.save(function (err, doc) {
                if (err) {
                    response.status(400).json(err).end();
                    throw err;
                }
                response.json(doc).end();
            });
        }
    },
    updateOrAddCity: (request, response) => {
        let id = mongoose.Types.ObjectId(request.swagger.params.cityId.value);
        let obj = Object.assign({}, request.swagger.params.body.value, { lastModifiedDate: new Date() });

        if (id) {
            City.update({_id: id}, obj, {upsert: true}, (err, res) =>
            {
                if (err) {
                    response.status(400).json({message: err.message}).end();
                    throw err;
                }
                let result = res.nModified === 1 ? {message: `Document with id ${request.swagger.params.cityId.value} was updated `} : {message: `New document was created with id ${request.swagger.params.cityId.value}`};

                response.json(result).end();
            });
        }
    },
    deleteCityById: (request, response) => {
        let id = mongoose.Types.ObjectId(request.swagger.params.cityId.value);
        City.findByIdAndRemove(id, function (err, res) {
            if (err) {
                response.status(400).json(err).end();
                throw err;
            }

            let status = res ? 200 : 404;
            let result = res ? res : {message: `Document not found`};
            response.status(status).json(result).end();
        });
    },


};