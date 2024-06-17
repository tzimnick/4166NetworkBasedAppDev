const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middleware/auth');
const {validateSignUp, validateLogIn, validateResult} = require('../middleware/validator');

const router = express.Router();

router.get('/new', isGuest, controller.signUp);
router.post('/', isGuest, validateSignUp, validateResult, controller.createUser);
router.get('/login', isGuest, controller.login);
router.post('/login', isGuest, validateLogIn, validateResult, controller.loginPost);
router.get('/profile', isLoggedIn, controller.profile);
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;