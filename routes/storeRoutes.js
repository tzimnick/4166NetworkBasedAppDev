const express = require('express');
const router = express.Router();
const controller = require('../controllers/storeController');
const { upload } = require('../middleware/fileUpload');
const {isLoggedIn, isSeller} = require('../middleware/auth');
const {validateId, validateMovie, validateResult} = require('../middleware/validator');
const offerRoutes = require('./offerRoutes');

//GET /: send all stories to the user
router.get('/', controller.index);

//GET /new: send html form for creating a new movie
router.get('/new', isLoggedIn, controller.new);

//POST /: create a new movie
router.post('/', isLoggedIn, upload, validateMovie, validateResult, controller.create);

//GET /:id: send details of movie identified by id
router.get('/:id', validateId, controller.show);

//GET /:id/edit: send html form for editing an existing movie
router.get('/:id/edit', validateId, isLoggedIn, isSeller, controller.edit);

//PUT /:id: update the movie identified by id
router.put('/:id', validateId, isLoggedIn, isSeller, upload, validateMovie, validateResult, controller.update);

//DELETE /:id: deletes the movie identified by id
router.delete('/:id', validateId, isLoggedIn, isSeller, controller.delete);

router.use('/offers', offerRoutes);

module.exports = router;