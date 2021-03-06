

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    amount: {
        type: Number,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})
var Cards = mongoose.model('Card', cardSchema);
module.exports = Cards;