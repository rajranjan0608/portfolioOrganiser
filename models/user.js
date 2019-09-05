var mongoose                =require("mongoose");
var passportLocalMongoose   =require("passport-local-mongoose");

//TABLE SCHEMA
var userSchema=new mongoose.Schema({

    username:String,
    email:String,
    fullName:String,
    profileImage:String,

    userType:String,

    password:String,
    resetPasswordToken:String,
    resetPasswordExpires:Date,

    isConfirmedToken:String,
    isConfirmed:Boolean,

    searchKeyWords:String,

    about:[
        {
            info:String,
            linkedin:String,
            github:String,
            facebook:String,
            twitter:String
        }
    ],
    projects:[
        {
            briefTitle:String,
            briefDesc: String,
            techUsed: String
        }
    ],
    skills:[
        {
            title:String,
            isCustomInfo:Boolean,
            customInfo:String,
            expertise:String,
            experience:String,
            usedInProjects:String
        }
    ],
    experience:[
        {
            title:String,
            isWorked:Boolean,
            period:String,
            organisation:String
        }
    ],
    education:[
        {
            title:String,
            degree:String,
            period:String,
            location:String
        }
    ],
    awards:[
        {
            title:String,
            year:Number,
            how:String,
            organisation:String
        }
    ]

});

userSchema.plugin(passportLocalMongoose);

//MAKING TABLE
var users=new mongoose.model("users", userSchema);

//EXPORTING MODULE
module.exports=users;