var mongoose = require( 'mongoose' );

/* ********************************************
message SCHEMA
******************************************** */
var chatSchema = new mongoose.Schema({
     user      : [mongoose.Schema.Types.ObjectId],
     chat      : [{msg : String, sentOn: Date, sentBy: String }]
});
// Build the User model
module.exports = mongoose.model( 'Chat', chatSchema );
