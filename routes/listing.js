const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLogged,isOwner,validationListing} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



// New Route
router.get("/new",isLogged,listingController.renderNewForm);
// Edit Route
router.get("/:id/edit",isLogged,isOwner,wrapAsync(listingController.editListings));

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLogged,upload.single('listing[image]'),validationListing,wrapAsync(listingController.createListings));



router.route("/:id")
.get(wrapAsync(listingController.fetchOnelisting))
.put(isLogged,isOwner,upload.single('listing[image]'),validationListing,wrapAsync(listingController.updateListings))
.delete(isLogged,isOwner,wrapAsync(listingController.deleteListing));








module.exports = router;