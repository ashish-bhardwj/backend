const mongoose=require('mongoose');

var Book=mongoose.model('Book',{
    bookTitle: {type:String},
    topic: {type:String},
    author:{type:String},
    cost: {type:Number},
    description:{type:String},
    rating:{type:Number},
    count:{type:Number},
    issued:{type:Boolean},
    imageUrl:{type:String}
});
module.exports={
    Book
};