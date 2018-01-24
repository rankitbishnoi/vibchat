const mongoose = require('mongoose');
const express = require('express');
const userRouter = express.Router();

const userModel = mongoose.model('User');
var responseGenerator = require('./../../libs/responseGenerator');

module.exports.controller = (app) => {

     userRouter.post('/login', (req, res) => {
          userModel.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]},function(err,foundUser){
               if(err){
                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                    res.json(myResponse);
               }
               else if(foundUser==null || foundUser==undefined || foundUser.username==undefined){

                    var myResponse = responseGenerator.generate(true,"user not found. Check your email and password",404,null);
                    res.json(myResponse);
               }
               else{
                    req.session.user = foundUser;
                    req.session.user.password = ' ';
                    var myResponse = responseGenerator.generate(false,"Login Success",123,req.session.user);
                    res.json(myResponse);

               }
          });
     });//end login

     userRouter.post('/register', (req, res) => {
          if(req.body.username!=undefined && req.body.firstName!=undefined && req.body.lastName!=undefined && req.body.email!=undefined && req.body.password!=undefined){

               var newUser = new userModel({
                    username            : req.body.username,
                    firstname           : req.body.firstName,
                    lastname            : req.body.lastName,
                    email               : req.body.email,
                    password            : req.body.password

               });// end new user
               newUser.save((err) =>{
                    if(err){

                         var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                         res.json(myResponse);
                    }
                    else{
                         req.session.user = newUser;
                         req.session.user.password = ' ';
                         var myResponse = responseGenerator.generate(false,"register Success",500,req.session.user);
                         res.json(myResponse);
                    }
               });//end new user save
          }
          else{
               var myResponse = {
                    error: true,
                    message: "Some body parameter is missing",
                    status: 403,
                    data: null
               };
               res.json(myResponse);
          }
     });

     userRouter.get('/user', (req, res) => {
          if (req.session != undefined && req.session != null){
               var myResponse = responseGenerator.generate(false,"register Success",500,req.session.user);
               res.json(myResponse);
          }else {
               var myResponse = responseGenerator.generate(true,"Please login first",404,null);
          }
     });

     userRouter.get('/logout', (req, res) => {
          req.session.user = ' ';
     });

     app.use('/server', userRouter);
}
