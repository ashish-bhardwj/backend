const mongoose=require('mongoose');

const IssueSchema=new mongoose.Schema({
    user_id: {type:String},
    firstName:{type:String},
    email:{type:String},
    book_id: {type:String},
    bookTitle:{type:String}
});


const Issue = module.exports = mongoose.model('Issue', IssueSchema);