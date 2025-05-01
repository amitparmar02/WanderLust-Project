const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const ReviewController = require("../controllers/reviews.js");
const Listing = require("../models/listing.js");
const {validationReview, isLogged,isReviewAuthor} = require("../middlewares.js");





router.post("/",isLogged,validationReview,wrapAsync(ReviewController.createReviews));

// review Delete
router.delete("/:reviewId",isLogged,isReviewAuthor,wrapAsync(ReviewController.deleteReview));


module.exports = router;