const model = require('../models/offer');
const Movie = require('../models/store');

exports.makeOffer = (req, res, next) => {
    let movieID = req.params.id;
    let newOffer = {
        user: req.session.user,
        item: movieID,
        amount: req.body.amount,
        status: 'pending'
    }
    // console.log(newOffer);
    Promise.all([model.findOneAndUpdate({user: req.session.user, item: movieID}, newOffer, {new: true, upsert: true, includeResultMetadata: true}), Movie.findById(movieID)])
    .then((results) => {
        const [updateReturn, movie] = results;
        let updatedExisting = updateReturn.lastErrorObject.updatedExisting;
        let offer = updateReturn.value;
        console.log(offer);
        if(offer.amount > movie.highestOffer) {
            movie.highestOffer = offer.amount;
            req.flash('success', 'You made the new highest offer!');
        } else {
            req.flash('success', 'Offer made, but is not the highest offer!');
        }
        if(!updatedExisting) {
            movie.totalOffers += 1;
            return (Movie.findByIdAndUpdate(movieID, movie, {useFindAndModify: false, runValidator: true}));
        } else {
            return (Movie.findByIdAndUpdate(movieID, movie, {useFindAndModify: false, runValidator: true}));
        }
    }).then((item) => {
        res.redirect('back');
    })
    .catch(err=>next(err));
}


exports.viewOffers = (req, res, next) => {
    
    let movieID = req.params.id;
    model.find({item: movieID}).populate('user', 'firstName lastName').populate('item', 'title')
    .then((offers) => {
        let isAccepted = false;
        if(offers.forEach(offer => {
            if(offer.status == "accepted") {
                isAccepted = true;
            }
        }));
        res.render('./offers/offers', {offers, isAccepted});
        
    })
    .catch(err=>next(err));
}


exports.acceptOffer = (req, res, next) => {
    let offerID = req.params.id;

    model.findById(offerID)
        .then(offer => {
            let movieID = offer.item;
            return Promise.all([
                model.updateMany({item: movieID, _id: {$nin: [offerID]}}, {$set: {status: "rejected"}}),
                Movie.findByIdAndUpdate(movieID, {$set: {active: false}}, {useFindAndModify: false, runValidators: true}),
                model.findByIdAndUpdate(offerID, {$set: {status: "accepted"}}, {useFindAndModify: false, runValidators: true})
            ]);
            
        })
        .then(item => {
            res.redirect('back');
        })
        .catch(err=>next(err));
}