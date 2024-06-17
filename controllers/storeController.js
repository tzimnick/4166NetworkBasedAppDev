const Movie = require('../models/store');
const Offer = require('../models/offer');

exports.index = (req, res, next) => {
    let query = {};
    let searchString =req.query.search;
    const regex = new RegExp("^" + searchString, "i");
    if(searchString) {
        const regex = new RegExp(searchString, "i");
        query = {$or:[{title: regex}, {details: regex}]};
    }
    let parts = Movie.find(query)
    .then(parts => {
        parts = parts.sort((a, b) => a.price-b.price);
        res.render('./movieViews/index', {parts});
    })
    .catch(err => next(err));
};

exports.show = async (req, res, next) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const movie = await Movie.findById(id).populate('seller', 'firstName lastName');
        if (movie) {
            res.render('./movieViews/show', { movie });
        } else {
            const err = new Error('Cannot find a movie with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        console.error("Error fetching movie by id:", error);
        next(error);
    }
};

exports.edit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);
        if (movie) {
            res.render('./movieViews/edit', { movie });
        } else {
            const err = new Error('Cannot find a movie with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        console.error("Error fetching movie by id:", error);
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const movieData = req.body;
        const id = req.params.id;
        const success = await Movie.findByIdAndUpdate(id, movieData);
        if (success) {
            req.flash('success', 'Movie updated successfully!');
            res.redirect('/movies/' + id);
        } else {
            const err = new Error('Cannot find a movie with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch (error) {
        console.error("Error updating movie:", error);
        next(error);
    }
};

exports.new = (req, res) => {
    res.render('./movieViews/new');
};

exports.create = async (req, res, next) => {
    try {
        console.log(req.body);
        let newMovieObject = req.body;
        newMovieObject.image = "/images/" + req.file.filename;
        newMovieObject.seller = req.session.user;
        newMovieObject.totalOffers = 0;
        newMovieObject.active = true;
        await Movie.create(newMovieObject);
        req.flash('success', 'Movie created successfully!');
        res.redirect('/movies');
    } catch (error) {
        console.error("Error creating movie:", error);
        next(error);
    }
};

exports.delete = (req, res, next) => {
    
    const id = req.params.id;
    
    Promise.all([Offer.deleteMany({item: id}), Movie.findByIdAndDelete(id)])
    .then((results) => {
        if(results[1]) {
            req.flash('success', 'Movie deleted successfully!');
            res.redirect('/movies');
        } else {
            const err = new Error('Cannot find a movie with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};
