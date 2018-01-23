var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
     firstname: String,
     lastname: String,
     username: String,
     password: String,
     email: String
});

module.exports = mongoose.model('User', userSchema);
