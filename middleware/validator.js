const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

//trim method removes excess spaces from data input
//escape method removes special characters for scripts, e.g. <% and %> for express
exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateMovie = [
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('price', 'Price cannot be empty').notEmpty().isNumeric({min: 0.01}).trim().escape(),
    body('condition', 'Condition cannot be empty').notEmpty().isIn(['new', 'light', 'moderate', 'heavy']).trim().escape(),
    body('details', 'Details cannot be empty').isLength({min: 10}).trim().escape()
];

exports.validateOffer = [
    body('amount', 'Amount cannot be empty').notEmpty().isNumeric({min: 0.01}).trim().escape()
]

exports.validateResult = (req, res, next) => {
    //server side validation prevents script insertion, etc.
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}
