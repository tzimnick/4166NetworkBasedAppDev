const offer = require('../models/offer');
const Store = require('../models/store');

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
}

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to login first');
        return res.redirect('/users/login');
    }
}

//check if user is the seller
exports.isSeller = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid movie id');
        err.status = 400;
        return next(err);
    }

    Store.findById(id)
    .then(movie => {
        if(movie) {
            if(movie.seller == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a movie with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

//check if user is NOT the seller
exports.isNotSeller = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid movie id');
        err.status = 400;
        return next(err);
    }

    Store.findById(id)
    .then(movie => {
        if(movie) {
            if(movie.seller != req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a movie with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

//Check if the user is the seller for this offered item
exports.isOfferSeller = (req, res, next) => {
    let id = req.params.id;

    offer.findById(id).populate('item')
    .then(offer => {
        if (offer) {
            if (offer.item.seller == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find item with id ', id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
}