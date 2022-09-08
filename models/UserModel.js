const mongoose =require('mongoose')

//creating USER schema 
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:{type:String , required:true},
    email : {type:String , required:true, trim : true,unique:true},
    password : { type : String, require:true}, 
    role : { type:String , require:true, default:'BasicUser', enum:['BasicUser','AdminUser']},
    Accesstoken:{type:String}
})
const User =module.exports = mongoose.model('users', UserSchema) // exporting


