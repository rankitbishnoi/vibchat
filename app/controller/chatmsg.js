const mongoose = require('mongoose');
const express = require('express');
const userRouter = express.Router();

const chatModel = mongoose.model('Chat');
var responseGenerator = require('./../../libs/responseGenerator');

module.exports.controller = (app) => {

     userRouter.get('/getchat', (req, res) => {console.log(a);
          var user1 = req.query.user1;
          var user2 = req.query.user2;
          chatModel.find({user : { $all : [user1, user2]}}, (err, messages)=> {console.log(b);
               if(err){

                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                    res.json(myResponse);
               }
               var myResponse = responseGenerator.generate(false,"request success",123,messages);
               res.json(myResponse);

               if (messages[0] === undefined && messages[0] === null){console.log(c);
                    var newChat = new chatModel({
                         user : room.subscribers,
                         chat : []
                    });// end new chat

                    newChat.save((err) =>{
                         if(err){

                              var myResponse = responseGenerator.generate(true,"Sorry, for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                              res.json(myResponse);
                         }
                    });//end new chat save
               }
          });
     });

     userRouter.post('/savechat', (req, res) => {console.log(3);
          var msg = req.body.msg;
          var reciever = req.body.reciever;
          var sender = req.body.sender;
          chatModel.findOneAndUpdate({user : { $all : [reciever, sender]}}, { $push: {chat: msg}}, (err) => {
               if(err){

                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldnt complete the action. Please try After some time."+err,500,null);
                    res.json(myResponse);
               }console.log(4);
          });
     });

     app.use('/server', userRouter);
}
