module.exports.controller = (server) => {

     var io = require('socket.io').listen(server);
     //=====================================
     const mongoose = require('mongoose');
     mongoose.Promise = require('bluebird');
     const chatModel = mongoose.model('Chat');

     var responseGenerator = require('./../libs/responseGenerator');

     const checkChat = (room) => {
          chatModel.find({user : { $all : room.subscribers}}, (err, messages)=> {
               if(err){

                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                    console.log(myResponse);
               }
               return messages;
               if (messages === undefined && messages === null){
                    var newChat = new chatModel({
                         user : room.subscribers,
                         chat : []
                    });// end new chat

                    newChat.save((err) =>{
                         if(err){

                              var myResponse = responseGenerator.generate(true,"Sorry, for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                              console.log(myResponse);
                         }
                    });//end new chat save
               }
          });
     };

     const saveChat = (msg, reciever, sender) => {
          chatModel.findOneAndUpdate({user : { $all : [reciever, sender._id]}}, { $push: {chat: msg}}, {new: true}, (err, chat) => {
               if(err){

                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldnt complete the action. Please try After some time."+err,500,null);
                    console.log(myResponse);
               }
          });
     };

     //=====================================
     var users = [];

     //=====================================

     io.sockets.on('connection', (socket) => {
          var rooms = [];
          var myself;

          socket.on('check and create room', (profile) => {
               socket.join('room1');
               myself = profile;
               if ( users.length >= 1) {
                    i = 1;
                    users.forEach((user) => {
                         var j = profile._id.substring(0,7) + i;

                         var obj = { name: j, subscribers : [user._id, profile._id], otheruser : profile.firstname + " " + profile.lastname, otheruserid: profile._id};
                         socket.broadcast.to('room1').emit('new user online', user._id, obj);

                         obj.otheruser = user.firstname + " " + user.lastname;
                         obj.otheruserid = user._id;
                         io.sockets.in('room1').emit('new user online', profile._id, obj);

                         i++;
                    });
               };
          });

          socket.on('add user', (profile) => {
               var i = 0;
               users.forEach((user)=> {
                    if (user != undefined || user != null) {
                         if (user._id === profile._id) {
                              i++;
                         }
                    }
               });
               if (i === 0) { users.push(profile);}
          });

          socket.on('join room', (room) => {
               socket.join(room.name);
               rooms.push(room);
          });

          socket.on('check for previous chat', (room) =>{
               var messages = checkChat(room);
               io.sockets.in(room.name).emit('previous chat', room.otheruserid, messages);
          });

          socket.on('send msg', (data) => {
               var message = {
                    msg: data.msg,
                    sentOn: Date.now(),
                    sentBy: data.user.firstname + " " + data.user.lastname
               };
               saveChat(message, data.room.otheruserid, data.user);
               io.sockets.in(data.room.name).emit('recieve msg', message, data.user);
          });

          socket.on('user started typing', (userid) => {
               socket.broadcast.to('room1').emit('user is typing', userid);
          });

          socket.on('user stopped typing', (userid) => {
               socket.broadcast.to('room1').emit('user stopped', userid);
          });

          socket.on('disconnect', () => {
               socket.broadcast.to('room1').emit('user offline', rooms);
          });

          socket.on('user offline', (list) => {
               var offlineroom;
               list.forEach((room) => {
                    if(room.otheruserid === myself._id) {
                         socket.leave(room.name);
                         offlineroom = room;
                    }
               });

               var i = rooms.indexOf(offlineroom);
               rooms.splice(i, 1);

          });
     });
}
