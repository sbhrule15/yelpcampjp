var express 	 = require("express"),
	router 		 = express.Router({mergeParams: true}),
	Campground	 = require("../models/campground"),
	Comment		 = require("../models/comment");

//COMMENTS ROUTE GET

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
		console.log(err);
	} else {
		res.render("comments/new", {campground: campground});
	}
	})
});

// COMMENTS POST ROUTE

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			res.redirect("/campgrounds");
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit", function(req, res){
	res.render("comments/edit");
});

//MIDDLEWARE

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;