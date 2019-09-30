var express=require('express');
var router=express.Router();
var ObjectId=require('mongoose').Types.ObjectId;

var {Book}=require('../models/book');
const Issue=require('../models/issue');
const Favourite=require('../models/favourite');
const Issued=require('../models/issue');

router.get('/issuedBooks',(req,res)=>{
    console.log('issuedbooks')
   Issue.find((err,docs)=>{
       if(!err){
           res.send(docs);   
             }
           else{
               console.log('error in retriving issued books list'+JSON.stringify(err,undefined,2));
           }
   });
});

//fetch all the books
router.get('/',(req,res)=>{
    Book.find((err,docs)=>{
        if(!err){
            res.send(docs);   
     }
            else{
                console.log('error in retriving all books'+JSON.stringify(err,undefined,2));
            }
    });
});

//fetch single book
router.get('/:id',(req,res)=>{
    Book.findById(req.params.id,(err,docs)=>{
        if(!err){
            res.send(docs);   
        console.log(docs)     }
            else{
                console.log('error in retriving single book'+JSON.stringify(err,undefined,2));
            }
    });
});

// fetch books for a user
router.get('/mybooks/:id',(req,res)=>{
  //  if(!ObjectId.isValid(req.params.id))
  //  return res.status(400).send(`No record with given id: ${req.params.id}`);
  const query = {user_id: req.params.id}
  const output = {book_id:1,_id:0}
    Issue.find(query,output,(err,docs)=>{
        if(!err){
            let result = docs.map(({ book_id }) => book_id)
            var obj_ids = result.map(function(id) { return ObjectId(id); });
            const query2 = { _id: { $in:obj_ids}}
            Book.find(query2,(err,docs)=>{
                if(!err){
                    res.send(docs);      
                 }
                    else{
                        console.log('error in retriving books for a user'+JSON.stringify(err,undefined,2));
                    }
            }); 
            }
            else{
                console.log('error in retriving user ids'+JSON.stringify(err,undefined,2));
            }
    });
});

// add books in the record
router.post('/',(req,res)=>{
   var book=new Book({
       bookTitle:req.body.bookTitle,
       topic:req.body.topic,
       author:req.body.author,
   //    cost:req.body.cost,
       description:req.body.description, 
       rating:req.body.rating,
       count:req.body.count,
       issued:req.body.issued,
       imageUrl:req.body.imageUrl
    });
    console.log(book);
    book.save((err,docs)=>{
        if(!err){
            res.send(docs);        }
            else{
                console.log('error in retriving saving books'+JSON.stringify(err,undefined,2));
            }
    });
});

// update books in the record
router.put('/:id',(req,res)=>{
  //  if(!ObjectId.isValid(req.params.id))
   // return res.status(400).send(`No record with given id: ${req.params.id}`);

    var book={
        bookTitle:req.body.bookTitle,
        topic:req.body.topic,
        author:req.body.author,
        cost:req.body.cost, 
        description:req.body.description, 
        rating:req.body.rating,
        count:req.body.count,
        issued:req.body.issued,
        imageUrl:req.body.imageUrl
    };
    Book.findByIdAndUpdate(req.params.id,{$set:book},{new :true},(err,docs)=>{
        if(!err){
            res.send(docs);        }
            else{
                console.log('error in updating books'+JSON.stringify(err,undefined,2));
            }
    });
});

// delete books from library
router.delete('/:id',(req,res)=>{
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id: ${req.params.id}`);

    Book.findByIdAndRemove(req.params.id,(err,docs)=>{
        if(!err){
            res.send(docs);        }
            else{
                console.log('error in deleting books'+JSON.stringify(err,undefined,2));
            }
    });
});

// return books to library
router.post('/return',(req,res)=>{
    const query = { $and: [{book_id: req.body.book_id},{user_id: req.body.user_id}]}
  
    Issue.remove(query,(err,docs)=>{
        if(!err){
            Book.updateOne({_id:req.body.book_id},{$inc:{count:1}},(err,docs)=>{
                if(!err){
                    res.send(docs);   
                }
                else{
                    console.log('error in update after returning books'+JSON.stringify(err,undefined,2));
                }
            });
               }
            else{
                console.log('error in returning books'+JSON.stringify(err,undefined,2));
            }
    });
});

// issue books
router.post('/issue',(req,res)=>{
    var issue=new Issue({
        user_id:req.body.user_id,
        firstName:req.body.firstName,
        email:req.body.email,
        book_id:req.body.book_id,
        bookTitle:req.body.bookTitle
     });

     Book.updateOne({_id:req.body.book_id},{$inc:{count:-1}},(err,docs)=>{
     });
     issue.save((err,docs)=>{
         if(!err){
                res.json({success: true, msg:'Book issued'});        }
             else{
                res.json({success: false, msg:'Internal Server error'});
             }
     });
 });


 // add favourite books
router.post('/favourite',(req,res)=>{
    var favourite=new Favourite({
        user_id:req.body.user_id,
        firstName:req.body.firstName,
        email:req.body.email,
        book_id:req.body.book_id,
        bookTitle:req.body.bookTitle,
        category:req.body.category
     });

     favourite.save((err,docs)=>{
         if(!err){
                res.json({success: true, msg:'Book added to favourites'});        }
             else{
                res.json({success: false, msg:'Internal Server error'});
             }
     });
 });

 // fetch favourite books
 router.get('/favourite/:id',(req,res)=>{
    //  if(!ObjectId.isValid(req.params.id))
    //  return res.status(400).send(`No record with given id: ${req.params.id}`);
    const query = {user_id: req.params.id}
    const output = {book_id:1,_id:0}
    Favourite.find(query,output,(err,docs)=>{
          if(!err){
              let result = docs.map(({ book_id }) => book_id)
              var obj_ids = result.map(function(id) { return ObjectId(id); });
              const query2 = { _id: { $in:obj_ids}}
              Book.find(query2,(err,docs)=>{
                  if(!err){
                      console.log(docs);
                      res.send(docs);      
                   }
                      else{
                          console.log('error in retriving books for a user'+JSON.stringify(err,undefined,2));
                      }
              }); 
              }
              else{
                  console.log('error in retriving user ids'+JSON.stringify(err,undefined,2));
              }
      });
  });



module.exports=router;