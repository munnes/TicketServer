
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const ticketSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    }
}, {
    timestamps: true
})
var Tickets = mongoose.model('Ticket', ticketSchema);
module.exports = Tickets;
