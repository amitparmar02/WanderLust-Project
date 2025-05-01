const Listing = require("./models/listing");
const Review = require("./models/reviews.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLogged =(req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please Logged in ");
        res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You Don't Have a Permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validationListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
  
    if(error){

        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.validationReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){

        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let reviews = await Review.findById(reviewId);
    
    if(!reviews.author.equals(res.locals.currUser._id)){
        req.flash("error","You Don't Have a Permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
