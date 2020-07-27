var express      = require("express"),
	app          = express(),
	bodyParser   = require("body-parser"),
	mongoose     = require("mongoose"),
	passport	 = require("passport"),
	LocalStrategy= require("passport-local"),
	methodOverride= require("method-override"),
	Campground	 = require("./models/campground"),
	Comment		 = require("./models/comment"),
	User	 	 = require("./models/user"),
	seedDB 		 = require("./seeds");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/camgrounds"),
	indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// seedDB();
app.use(require("express-session")({
	secret: "Aida is the cutest dog ever shut up",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// PASSTHROUGH OF USER DATA
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(commentRoutes);

app.listen(3000,function(){
	console.log("Request Made");

});