
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const User = new Schema({
    // usename and password auto created by passportLocalMongoose
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId:String,
    admin: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Currency,
        default: 0

    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }]

});
User.plugin(passportLocalMongoose)// this automatic add user name and hashed password
module.exports = mongoose.model('User', User);
