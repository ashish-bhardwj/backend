const mongoose=require('mongoose');

const FavouriteSchema=new mongoose.Schema({
    user_id: {type:String},
    firstName:{type:String},
    email:{type:String},
    book_id: {type:String},
    bookTitle:{type:String},
    category:{type:String}
});


const Favourite = module.exports = mongoose.model('Favourite', FavouriteSchema);