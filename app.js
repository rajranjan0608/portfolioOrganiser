var express             = require("express");
var mongoose            = require("mongoose");
var bodyParser          = require("body-parser");

var passport            =require("passport");
var localStrategy       =require("passport-local");

var randomString        =require("randomstring");

var user                = require("./models/user")
var projects            = require("./models/projects")

var app= express();

//CREATING EXPRESS-SESSION
app.use(require("express-session")({
    secret: "Hi there",
    resave: false,
    saveUninitialized: false
}));

//SETTING UP PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

var server= app.listen(3000, function(){
    console.log("Server started at port 3000");
});

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(function(req,res,next){
    res.locals.url=req.url;
    res.locals.currentUser=req.user;
    next();
});

mongoURI="mongodb://localhost/projectsPage";
// mongoURI=process.env.MONGOURI;

mongoose.connect(mongoURI,{useNewUrlParser: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.redirect("/landing");
    // res.redirect("/index");
});

app.get("/landing", function(req,res){
    res.render("landing.ejs");
    // res.redirect("/index");
});

// app.get("/index", function(req,res){
//     projects.find({},function(err, projects){
//         res.render("index.ejs", {projects:projects});
//     });
// });

app.get("/user/:username", function(req, res){
    user.findOne({username:req.params.username}, function(err, user){
        res.render("userPortfolio.ejs", {user:user});
    });
})

app.post("/about", function(req,res){
    user.findOne({username:req.body.username}, function(err,user){
        user.about=req.body.about;
        user.save();
    });    
    res.redirect(req.body.url);
});

app.post("/projects", function(req,res){
    user.findOne({username:req.body.username}, function(err,user){
        user.projects.push(req.body.project);
        user.save();
    });    
    res.redirect(req.body.url);
});

app.post("/skills", function(req,res){
    user.findOne({username:req.body.username}, function(err,user){
        user.skills.push(req.body.skills);
        user.save();
    });    
    res.redirect(req.body.url);
});

app.post("/experience", function(req,res){
    user.findOne({username:req.body.username}, function(err,user){
        user.experience.push(req.body.experience);
        user.save();
    });    
    res.redirect(req.body.url);
});

app.post("/education", function(req,res){
    user.findOne({username:req.body.username}, function(err,user){
        user.education.push(req.body.education);
        user.save();
    });    
    res.redirect(req.body.url);
});

app.post("/award", function(req,res){
    user.findOne({username:req.body.username}, function(err,user){
        user.awards.push(req.body.awards);
        user.save();
    });    
    res.redirect(req.body.url);
});

//AUTHENTICATION

app.post("/signup",function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var email=req.body.email;
    var fullName=req.body.fullName;
    var url=req.body.url;
    var searchKeyWords=username+" "+" "+email+" "+fullName;
    var profileImage="/img/default.png";

    const isConfirmedToken = randomString.generate({
        length: 24,
        charset: "alphanumeric"
    });

    var newUser= new user({username:username, email:email, isConfirmedToken:isConfirmedToken, searchKeyWords:searchKeyWords, fullName:fullName, profileImage:profileImage, isConfirmed:false})

    user.register(newUser,password,function(err,user){
        if(err){
            // req.flash("userNotCreated","An error has been occurred! Please try again in a bit.")
            res.redirect(url);
            return next();
        }

        passport.authenticate("local")(req,res,function(){
            // req.flash("userCreated","User created successfully! Please verify your email.")
            res.redirect(url);
        });
        
        // registeredUsers=registeredUsers+1;
        
        // fs.readFile("./public/emails/welcome.html", function(err, buf) {
            
        //     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            
        //     var msg={
        //         to          : email,
        //         from        : {
            
        //                         email: "welcome@gamingtour.com",
        //                         name : "Gaming Tour"
        //                       },
        //         subject     :   "Welcome to Gaming Tour",
        //         html        :   "<h4>Hi, "+fullName+",</h4><br> This is a system generated mail, in order to check wether you are receiving mails on this email address or not.<br><br><strong>Please verify your email address by clicking on the link given below.</strong><br><br>"+
        //                         "<a href='"+process.env.DOMAINADDRESS+"/emailVerification?username="+username+"&isConfirmedToken="+isConfirmedToken+"'>Click this link to Verify</a><br><br>"+buf.toString()
        //     };
        
        //     sgMail.send(msg);
        
        // }); 

    });
});

//LOGIN PAGE : AUTHENTICATION
app.post("/signin",function(req,res){

    passport.authenticate("local",{failureRedirect:"/", failureFlash:"Failed"})(req,res,function(){
        if(req.user){
            // signedUser=signedUser+1;
            // req.flash("login","signed In successfully!");
            res.redirect(req.body.url); 
            
        }else{
            // req.flash("error","Authentication problem, Please try again!");
            res.redirect(req.body.url);
            
        }
    });    
});

//SOCKET PROGRAMMING ALONG WITH MONGODB DATABASE

//IMPORTING SOCKET
var socket          =require("socket.io");

//SOCKET SETUP : ON THE SERVER SIDE
var io=socket(server);

//LISTENING FROM THE CLIENTS
io.on("connection",function(socket){

    socket.on("searchUsers",function(data){
        var q=data;
    
        user.find({
            searchKeyWords:{$regex: new RegExp(q,"i")}
        }, function(err,data){
            if(data.length<=0){
                io.to(socket.id).emit("searchUsers",
                    {
                        usersFound:false,
                        message:"No User Found"
                    }
                );
            }else{
                io.to(socket.id).emit("searchUsers",data);
            }
        }
        ).limit(10);
 
    });

});