var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var User = require("./models/user");
var Music = require("./models/music");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");


app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "music store",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

mongoose.connect("mongodb://localhost/E-commerce");

app.set("view engine", "ejs");
app.use(express.static(__dirname));





app.get("/musicstore", function(req, res){
	Music.find({}, function(err, music){
		if(err){
			console.log(err);
		}else{
			res.render("index", {music: music});
		}
	})

})


app.get("/music/:id", function(req, res){
	Music.findById(req.params.id, function(err, foundMusic){
		if(err){
			console.log(err);
		}else{
			res.render("music", {music: foundMusic})
		}
	});
})

app.get("/signup", function(req, res){
	res.render("signup");
})

app.post("/signup", function(req, res){

	var user = new User({
		username: req.body.username,
		email: req.body.email,
		admin: false
	});
	User.register(user, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/musicstore");
		})
	})
})

app.get("/login", function(req, res){
	res.render("login");
})

app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/musicstore",
		failureRedirect: "/login"
	}), function(req, res){
})

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/musicstore");
})

app.get("/admin", isLoggedIn, function(req, res){
	if(req.user.admin){
		res.render("admin");
	}else{
		res.redirect("/musicstore");
	}
	
})

app.post("/addMusic", function(req, res){
	var music = new Music({
		musicname: req.body.musicname,
		price: req.body.price,
		cover: req.body.cover,
		description: req.body.description
	});
	music.save(function(err, music){
		if(err)
		{
			console.log("Error when adding music");
		}
		else
		{
			console.log("New music added");
		}
	})
	res.redirect("/admin");
})

app.get("/editMusic/:id", function(req, res){
	Music.findById(req.params.id, function(err, foundMusic){
		if(err){
			res.redirect("/musicstore");
		}else{
			res.render("edit", {music: foundMusic});
		}
	})
	
});

app.put("/editMusic/:id", function(req, res){
	Music.findByIdAndUpdate(req.params.id, req.body.music, function(err, updatedMusic){
		if(err){
			res.redirect("/musicstore");
		}else{
			res.redirect("/music/" + req.params.id);
		}
	})
})

app.delete("/deleteMusic/:id", function(req, res){
	Music.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/musicstore");
		}else{
			res.redirect("/musicstore");
		}
	})
});

app.get("/cart", isLoggedIn, function(req, res){
	User.findOne({_id: req.user._id}).populate("cart").exec(function(err, user){
		if(err){
			console.log(err);
		}else{
			res.render("cart", {user:user});
		}
	})
})

app.get("/buy/:mucisId", function(req, res){
	Music.findById(req.params.mucisId, function(err, foundMusic){
		if(err){
			console.log(err);
		}else{
			User.findOne({_id: req.user._id}, function(err, foundUser){
				if(err){
					console.log(err);
				}else{
					foundUser.cart.push(foundMusic);
					foundUser.save(function(err, data){
						if(err){
							console.log(err);
						}else{
							console.log(data);
						}
					})
				}
			})
		}
	})
	res.redirect("/musicstore");
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}



app.listen(3000, function () {
    console.log("The E-commerce Server Has Started!");
});