const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Check input validation in ejs files
const offerSchema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required']},
    item: {type: Schema.Types.ObjectId, ref: 'Movie', required: [true, 'item is required']},
    amount: {type: Number, min: [0.01, 'minimum value is 0.01'], required:[true, 'price is required']},
    status: {type: String, enum: {values:['pending', 'rejected', 'accepted']}, default: 'pending', required:[true, 'status is required']}
});

offerSchema.index({user: 1, offer: 1});

module.exports = mongoose.model('Offer', offerSchema);
