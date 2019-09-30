const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/Library',(err)=>{
    if(!err)
    console.log('connection successful');
    else
    console.log('Error in db:'+JSON.stringify(err,undefined,2));
});

module.exports=mongoose;
