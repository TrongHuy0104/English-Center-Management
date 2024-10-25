const Center = require('../models/CenterModel');
const factory = require('./handlerFactory');

exports.getAllCenters = factory.getAll(Center);
exports.getCenter = factory.getOne(Center);
exports.createCenter = factory.createOne(Center);
exports.updateCenter = factory.updateOne(Center);
exports.deleteCenter = factory.deleteOne(Center);
