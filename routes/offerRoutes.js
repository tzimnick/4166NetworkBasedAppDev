const express = require('express');
const router = express.Router();
const controller = require('../controllers/offerController');
const { isLoggedIn, isSeller, isNotSeller, isOfferSeller } = require('../middleware/auth');
const { validateOffer, validateResult } = require('../middleware/validator');

//make an offer
router.post('/:id', isLoggedIn, isNotSeller, validateOffer, validateResult, controller.makeOffer);

//view all offers
router.get('/:id', isLoggedIn, isSeller, controller.viewOffers);

//accept an offer
router.post('/:id/accept', isLoggedIn, isOfferSeller, controller.acceptOffer);


module.exports = router;