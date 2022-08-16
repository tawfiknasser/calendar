const mongoose = require('mongoose');
const { serverSelectionTimeoutMS } = require('../config');

const MONGO_CONNECTION = process.env.MONGO_CONNECTION || 'mongodb://192.165.0.5:27017/robotmongo';

module.exports = () => mongoose.connect(MONGO_CONNECTION, {
  useNewUrlParser: true,
  serverSelectionTimeoutMS,
});
