

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
    },
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
   
}, {
    timestamps: true
})
var Trips = mongoose.model('Trip', tripSchema);
module.exports = Trips;