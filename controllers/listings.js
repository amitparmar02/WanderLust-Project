const Listing = require("../models/listing.js");


module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});

    res.render("listings/index.ejs",{allListings})
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.fetchOnelisting = async (req,res)=>{
    let {id} = req.params;

    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};


module.exports.createListings = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename
    const newListings = new Listing(req.body.listing);
    newListings.owner = req.user._id;
    newListings.image = {url,filename}
    await newListings.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");  
};

module.exports.editListings = async(req,res)=>{
    let {id} = req.params;
    let getListing = await Listing.findById(id);
    if(!getListing){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }
    let originalUrl = getListing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{getListing,originalUrl});
};

module.exports.updateListings =async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
    
        listing.image = {url,filename}
        await listing.save();
    }
    
    req.flash("success","Listing Updated Successfully!!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing =async(req,res)=>{
    let {id} = req.params;

    let deleteListing  = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};