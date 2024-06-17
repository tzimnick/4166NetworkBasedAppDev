const model = require('../models/user');
const Movie = require('../models/store');
const Offer = require('../models/offer');

//get sign up form
exports.signUp = (req, res)=>{
    res.render('users/new');
};

//create new user
exports.createUser = (req, res, next)=>{
    let user = new model(req.body);
    if(user.email) {
        user.email = user.email.toLowerCase();
    }
    user.save()
    .then(()=>{
        req.flash('success', "Account created successfully!");
        res.redirect('/users/login')
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }
        if(err.code === 11000) {
            req.flash('error', 'Email address already in use');
            return res.redirect('/users/new');
        }
        next(err);
    });
};

//get the login form
exports.login = (req, res)=>{
    res.render('users/login');
};

//process login request
exports.loginPost = (req, res, next)=>{
    //authenticate login request
    let email = req.body.email;
    if(email) {
        email = email.toLowerCase();
    }
    let password = req.body.password;

    //get user that matches input email
    model.findOne({email: email})
    .then(user=>{
        if(user) {
            //user found in database
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id; //store user's id in the session
                    req.flash('success', "You have successfully logged in");
                    res.redirect('/users/profile');
                } else {
                    // console.log('wrong password');
                    req.flash('error', 'Wrong password!');
                    res.redirect('/users/login');
                }
            })
        } else {
            //User not found in database
            // console.log('wrong email address');
            req.flash('error', 'Wrong email address!');
            res.redirect('/users/login');
        }
    })
    .catch(err=>next(err));
};

//get profile
exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Movie.find({seller: id}), Offer.find({user: id}).populate('item', 'title id')])
    .then(results=>{
        const [user, movies, offers] = results;
        res.render('./users/profile', {user, movies, offers});
    })
    .catch(err=>next(err));
};

//logout user
exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    });
};