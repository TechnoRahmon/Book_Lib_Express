const mongoose =require('mongoose')
const User = require('./UserModel')


//creating USER schema 
const Schema = mongoose.Schema

const BookSchema = new Schema({
    title:{type:String , required:true},
    author : {type:String , required:true},
    genre:{type:String , required:true},
    rates : [{ 
        stars:{type:Number, max:5},
        _id:{ type:Schema.Types.ObjectId, ref:'users'}
        
    }],
    TotalRates: {type:Number, max :5}
    
    
})

const Book =module.exports = mongoose.model('books', BookSchema) // exporting


module.exports.getAll = (callback, limmit)=>{
        Book.find(callback).limit(limmit).populate('rates._id','name role');
}
 
module.exports.getOnlyWithTotalRates = Book.aggregate([{  $project:{rates:0}  }])
