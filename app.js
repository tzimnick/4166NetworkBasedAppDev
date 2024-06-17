const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const storeRoutes = require('./routes/storeRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session'); //npm i express-session
const MongoStore = require('connect-mongo'); //npm i connect-mongo
const flash = require('connect-flash'); //npm i connect-flash
const User = require('./models/user'); //links to user.js in models folder
const path = require('path');

const app = express();

let port = 3000;
let host = 'localhost';
let url = "mongodb+srv://tzimnick:6728Fall2023_@cluster0.adold7t.mongodb.net/nbda-project3?retryWrites=true&w=majority&appName=Cluster0";

app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}) //useCreateIndex: true caused issues when included
    .then(() => {
        app.listen(port, host, () => {
            console.log('Server is running on port', port);
        });
    })
    // console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

// Middleware
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(
    session({
        secret: 'jiaru90aeur90ef93oioefe',
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 60*60*1000}, //60 mins, 60 secs, 1000 milliseconds = 1 hour
        store: new MongoStore({mongoUrl: url}) //same url as connecting to database
    })
);

app.use(flash());

app.use((req, res, next)=>{
    // console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/movies', storeRoutes);
app.use('/users', userRoutes);

// 404 error handling
app.use((req, res, next) => {
    const err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

// 500 error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).render('error', { error: { status, message } });
});
