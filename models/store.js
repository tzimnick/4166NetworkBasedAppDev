const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Check input validation in ejs files
const movieSchema = new mongoose.Schema({
    active: {type: Boolean, required: [true]},
    title: {type: String, required: [true, 'title is required']},
    genre: {type: String, required:[true, 'genre is required']},
    condition: {type: String, enum: {values:['new', 'light', 'moderate', 'heavy']}, required:[true, 'condition is required']},
    price: {type: Number, min: [0.01, 'minimum value is 0.01'], required:[true, 'price is required']},
    details: {type: String, required:[true, 'details is required']},
    image: {type: String, required:[true, 'image is required']},
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    totalOffers: {type: Number, default: 0, required:[true, 'totalOffers is required']},
    highestOffer: {type: Number, default: 0, required: [true, 'highestOffer is required']}
});

movieSchema.index({title: 'text', deatils: 'text'});

module.exports = mongoose.model('Movie', movieSchema, 'events');
