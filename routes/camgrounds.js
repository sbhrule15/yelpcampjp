var express 	 = require("express"),
	router 		 = express.Router({mergeParams: true}),
	passport	 = require("passport"),
	Campground	 = require("../models/campground"),
	Comment		 = require("../models/comment"),
	User	 	 = require("../models/user");

//CAMPGROUND GET

router.get("/", function(req, res){
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
});

//POST ROUTE

router.post("/", isLoggedIn, function(req, res){
	//PULLING IN DATA
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	//CREATE AND PUSH OBJECT ON ARRAY
	var newCampground = {name: name, image: image, description: description, author:author};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log("Could not create Campground");
		} else {
			res.redirect("/campgrounds");
		}
	});
	// REDIRECT
});

//CREATE CAMPGROUND: GET

router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW ROUTE

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT ROUTE

router.get("/:id/edit", function(req, res){
	if(req.isAuthenticated){
		
	}
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("/campground");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

router.put("/:id", isLoggedIn, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE

router.delete("/:id", isLoggedIn, function (req, res){
	
	
	Campground.findByIdAndRemove(req.params.id, function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;