var mongoose                =require("mongoose");

//TABLE SCHEMA
var projectSchema=new mongoose.Schema({

    briefTitle: String,
    briefDesc: String,
    techUsed: String
    
});

//MAKING TABLE
var projects=new mongoose.model("projects", projectSchema);

//EXPORTING MODULE
module.exports=projects;