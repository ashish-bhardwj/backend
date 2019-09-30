var express=require('express');
var router=express.Router();
var passport=require('passport');
const jwt = require('jsonwebtoken');


//const {User}=require('../models/user');
const User=require('../models/user');

router.post('/',(req,res)=>{
    var newUser=new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:req.body.password
     });
     User.addUser(newUser, (err, user) => {
        if(err){
          res.json({success: false, msg:'Failed to register user'});
        } else {
          res.json({success: true, msg:'User registered'});
        }
      });
    });

 router.post('/authenticate', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    User.getUserByEmail(email, (err, user) => {
      if(err) throw err;
      if(!user){
        return res.json({success: false, msg: 'User not found'});
      }
  
      User.comparePassword(password, user.password, (err, isMatch) => {
      
        if(err) throw err;
        if(isMatch){

          const token = jwt.sign(user.toJSON(), 'SECRET#123', {
            expiresIn: '365d' // 1 year
          });
  
          res.json({
            success: true,
            token: 'JWT '+token,
            user: {
              user_id: user._id,
              firstName: user.firstName,
              lastName:user.lastName,
              email: user.email
            }
          });
        } else {
          return res.json({success: false, msg: 'Wrong password'});
        }
      });
    });
  });

  router.post('/google', (req, res, next) => {
    let promise = User.findOne({email:req.body.email}).exec();
    promise.then(function(result){
      console.log(result);
    if(result) {
      let token = jwt.sign({name:result.firstName , email:result.email},'secret', {expiresIn : "365d"});
      return res.json({
        success: true,
        token: 'JWT '+token,
        user: {
          user_id:result._id,
          firstName: result.firstName,
          lastName:result.lastName,
          email: result.email
        }
      });
    }else{
        var newUser = new User({
        firstName : req.body.firstName,
        lastName:req.body.lastName,
        email: req.body.email,
      });
    
     let promise1 = newUser.save();
      
      promise1.then(function(doc){
        let token2 = jwt.sign({name:doc.firstName , email:doc.email},'secret', {expiresIn : "365d"});
        return res.json({
          success: true,
          token: 'JWT '+token2,
          user: {
            user_id:doc._id,
            firstName: doc.firstName,
            lastName:doc.lastName,
            email: doc.email
          }
        });
      })
    }
  })
  promise.catch(function(err){
    return res.status(500).json({message:'Some internal error'});
  })
  });



  router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
  });

 module.exports=router;