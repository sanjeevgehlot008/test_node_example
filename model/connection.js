var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodewebappdb');

var connectionOne = mongoose.connection;
module.exports = connectionOne;