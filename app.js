var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var User = require("./models/user");
var Music = require("./models/music");
var Orders = require("./models/orders");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var async = require("async");
var flash = require('connect-flash');


app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "music store",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

mongoose.connect("mongodb://localhost/E-commerce");

app.set("view engine", "ejs");
app.use(express.static(__dirname));


app.get("/", function(req, res){
	res.redirect("/musicstore");
})

app.get("/musicstore", function(req, res){
	var perPage = 4;
	var page = req.query.page || 1;
	var style = req.query.style || "";
	var artist = req.query.artist || "";
	var search = req.query.search || "";

	if(style != ""){
		if(!req.user||!req.user.admin){
			Music.find({ avaliable: true , style: style}).skip((perPage*page)-perPage).limit(perPage).exec(function(err, music){
				Music.find({ avaliable: true , style: style}).count().exec(function(err, count){
					if(err){
						console.log(err);
					}else{
						res.render("index", {music: music, search: search, style: style, artist: artist, page: page, pageNumber: Math.ceil(count/perPage)})
					}
				})
			})
		}else{
			Music.find({style: style}).skip((perPage*page)-perPage).limit(perPage).exec(function(err, music){
				Music.find({ style: style}).count().exec(function(err, count){
					if(err){
						console.log(err);
					}else{
						res.render("index", {music: music, search: search, style: style, artist: artist, page: page, pageNumber: Math.ceil(count/perPage)})
					}
				})
			})		
		}
		return;
	}else if(artist != ""){
		if(!req.user||!req.user.admin){
			Music.find({ avaliable: true , artist: artist }).skip((perPage*page)-perPage).limit(perPage).exec(function(err, music){
				Music.find({ avaliable: true , artist: artist }).count().exec(function(err, count){
					if(err){
						console.log(err);
					}else{
						res.render("index", {music: music, search: search, style: style, artist: artist, page: page, pageNumber: Math.ceil(count/perPage)})
					}
				})
			})
		}else{
			Music.find({ artist: artist }).skip((perPage*page)-perPage).limit(perPage).exec(function(err, music){
				Music.find({ artist: artist }).count().exec(function(err, count){
					if(err){
						console.log(err);
					}else{
						res.render("index", {music: music, search: search, style: style, artist: artist, page: page, pageNumber: Math.ceil(count/perPage)})
					}
				})
			})		
		}

	}else if(search != ""){
		if(!req.user||!req.user.admin){
			Music.find({ avaliable: true , musicname: { '$regex': search, '$options': 'i' }}).skip((perPage*page)-perPage).limit(perPage).exec(function(err, music){
				Music.find({ avaliable: true , musicname: { '$regex': search, '$options': 'i' }}).count().exec(function(err, count){
					if(err){
						console.log(err);
					}else{
						res.render("index", {music: music, search: search, style: style, artist: artist, page: page, pageNumber: Math.ceil(count/perPage)})
					}
				})
			})
		}else{
			Music.find({ musicname: { '$regex': search, '$options': 'i' } }).skip((perPage*page)-perPage).limit(perPage).exec(function(err, music){
				Music.find({ musicname: { '$regex': search, '$options': 'i' } }).count().exec(function(err, count){
					if(err){
						console.log(err);
					}else{
						res.render("index", {music: music, search: search, style: style, artist: artist, page: page, pageNumber: Math.ceil(count/perPage)})
					}
				})
			})		
		}

	}else{
		if(!req.user||!req.user.admin){
			Music.find({ avaliable: true }).skip((perPage*page)-perPage).limit(perPage).exec(function(err, music){
				Music.find({ avaliable: true }).count().exec(function(err, count){
					if(err){
						console.log(err);
					}else{
						res.render("index", {music: music, search: search, style: style, artist: artist, page: page, pageNumber: Math.ceil(count/perPage)})
					}
				})
			})
		}else{
			Music.find({}).skip((perPage*page)-perPage).limit(perPage).exec(function(err, music){
				Music.count().exec(function(err, count){
					if(err){
						console.log(err);
					}else{
						res.render("index", {music: music, search: search, style: style, artist: artist, page: page, pageNumber: Math.ceil(count/perPage)})
					}
				})
			})		
		}
	}	
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
			req.flash("error", err.message);
			return res.redirect("/signup");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to music store!");
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
		failureRedirect: "/login",
		failureFlash: true
	}), function(req, res){
})

app.post("/checkUser", function(req, res){
	console.log("1");
	console.log(req.body.uname);
	User.find({username: req.body.uname}).countDocuments().exec(function(err, count){
		if(err){
			console.log(err);
		}else{
			res.json(count);
		}
	})
})

app.get("/logout", isLoggedIn, function(req, res){
	req.logout();
	req.flash("success", "Sucessfully logged out");
	res.redirect("/musicstore");
})

app.get("/admin", isAdmin, function(req, res){
	if(req.user.admin){
		res.render("admin");
	}else{
		res.redirect("/musicstore");
	}
	
})

app.post("/addMusic", isAdmin, function(req, res){
	var music = new Music({
		musicname: req.body.musicname,
		price: req.body.price,
		cover: req.body.cover,
		style: req.body.style,
		artist: req.body.artist,
		review: req.body.review,
		avaliable: true,
		inventory: req.body.inventory
	});
	music.save(function(err, music){
		if(err)
		{
			req.flash("error", "Error when adding music");
		}
		else
		{
			req.flash("success", "New music added");			
		}
		res.redirect("/admin");
	})
	
})

app.get("/editMusic/:id", isAdmin, function(req, res){
	Music.findById(req.params.id, function(err, foundMusic){
		if(err){
			res.redirect("/musicstore");
		}else{
			res.render("edit", {music: foundMusic});
		}
	})
	
});

app.put("/editMusic/:id", isAdmin, function(req, res){
	var music = {
		musicname: req.body.musicname,
		price: req.body.price,
		cover: req.body.cover,
		style: req.body.style,
		artist: req.body.artist,
		review: req.body.review,
		avaliable: true,
		inventory: req.body.inventory
	};
	Music.findByIdAndUpdate(req.params.id, music, function(err, updatedMusic){
		if(err){
			req.flash("error", "Error when music was edited");
			res.redirect("/musicstore");
		}else{
			req.flash("success", "Edit successfully saved");
			res.redirect("/music/" + req.params.id);
		}
	})
})

app.delete("/deleteMusic/:id", isAdmin, function(req, res){
	Music.findById(req.params.id, function(err, foundMusic){
		if(err){
			req.flash("error", "Music not found");
			res.redirect("/musicstore");
		}else{
			foundMusic.avaliable = !foundMusic.avaliable;
			foundMusic.save(function(err, data){
				if(err){
					console.log(err);
				}else{
					req.flash("success", "Music was deleted successfully");
					res.redirect("/editMusic/" + req.params.id);
				}
			})
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

app.get("/buy/:mucisId", isLoggedIn, function(req, res){
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
							req.flash("error", "Error");
						}else{
							req.flash("success", "Music was added to cart");
						}
						res.redirect("/cart");
					})
				}
			})
		}
	})
	
})

app.get("/drop/:index", isLoggedIn, function(req, res){
	User.findOne({_id: req.user._id}, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			foundUser.cart.splice(req.params.index, 1);
			foundUser.save(function(err, data){
				if(err){
					req.flash("error", "Error");
				}else{
					req.flash("success", "Music was deleted from cart");
				}
				res.redirect("/cart");
			})
		}
	})
	
})

app.get("/checkout", isLoggedIn, function(req, res){
	
	if(req.user.cart === undefined || req.user.cart.length == 0)
	{
		req.flash("error", "Can not checkout with zero item");
		return res.redirect("/cart");		
	}
	var mark = true;
	User.findOne({_id: req.user._id}).populate("cart").exec(function(err, user){
		if(err){
			console.log(err);
		}else{
			user.cart.forEach(function(music){
				if(music.avaliable){
					mark = false;
				}
			})
			if(mark){
				req.flash("error", "Can not checkout with zero item");
				return res.redirect("/cart");
				
			}else{
				var orders = new Orders({
					userId: req.user._id
					
				});
				orders.save(async function(err, orders){
					if(err){
						console.log(err);
					}else{
						console.log(orders);

						var x = 0;
						var arr = req.user.cart;
						var loopArray = function(arr){
							oper(arr[x], function(){
								x++;
								if(x < arr.length){
									loopArray(arr);
								}
							})							
						}
						function oper(musicId, callback){
							Music.findById(musicId, function(err, foundMusic){	

								if(err){
									console.log(err);
								}else{
									if(foundMusic.avaliable){
										orders.item.push(foundMusic);
										orders.save(function(err, order){
											if(err){
												console.log(err);
											}else{
												console.log(orders);
												foundMusic.inventory--;
												if(foundMusic.inventory == 0){
													foundMusic.avaliable = false;
												}
												foundMusic.save(function(err, data){
													if(err){
														console.log(err);
													}else{
														console.log(data);
														callback();
													}
												})
											}
										})				
									}else{
										callback();
									}			
								}
							})	
						}
						
						loopArray(arr);
						User.findById(req.user._id, function(err, foundUser){
							foundUser.cart = [];
							foundUser.save(function(err, data){
								if(err){
									console.log(err);
								}else{
									req.flash("success", "Your order has been placed");
									res.redirect("/cart");
								}
							})
						})
					}
				})
			}
		}
	})	
})

app.get("/history", isLoggedIn, function(req, res){
	Orders.find({userId: req.user._id}).populate("item").exec(function(err, orders){
		res.render("orders", {orders: orders});
	})
})



function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first");
	res.redirect("/login");
}

function isAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.admin){
		return next();
	}
	req.flash("error", "Please login with administrator account");
	res.redirect("/login");
}



app.listen(3000, function () {
    console.log("The E-commerce Server Has Started!");
});