module.exports.controller = (app) => {
     
     var server = require('http').Server(app);
     var io = require('socket.io')(server);
     //=====================================
     const mongoose = require('mongoose');
     mongoose.Promise = require('bluebird');
     const chatModel = mongoose.model('Chat');

     var responseGenerator = require('./../libs/responseGenerator');

     const checkChat = (room) => {
          chatModel.find({chat : { $all : room.subscribers}}, (err, messages)=> {
               if(err){

                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                    res.json(myResponse);
               }
               return messages;
               if (messages === undefined && messages === null){
                    var newChat = new chatModel({
                         user : room.subscribers
                    });// end new chat

                    newChat.save((err) =>{
                         if(err){

                              var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                              res.json(myResponse)
                         }
                    });//end new chat save
               }
          });
     };

     const saveChat = (msg, reciever, sender) => {
          var obj = {
               msg: msg,
               sentOn: Date.now(),
               sentBy: sender.firstname + " " + sender.lastname
          };
          chatModel.findOneAndUpdate({chat : { $all : [reciever, sender._id]}}, { $push: {chat: obj}}, (err) => {
               if(err){

                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                    res.json(myResponse);
               }
          });
     };

     //=====================================
     var users = [];
     var rooms = [];
     var myself;

     //=====================================

     io.sockets.on('connection', (socket) => {

          socket.on('check and create room', (profile) => {
               socket.join('room1');
               myself = profile;
               if ( users.length >= 1) {
                    i = 1;
                    users.forEach((user) => {
                         var j = profile.id.substring(0,7) + i;

                         var obj = { name: j, subscribers : [user._id, profile._id], otheruser : profile.firstname + " " + profile.lastname, otheruserid: profile._id};
                         socket.broadcast.to('room1').emit('new user online', user._id, obj);

                         obj.otheruser = user.firstname + " " + user.lastname;
                         obj.otheruserid = user._id;
                         io.sockets.in('room1').emit('new user online', profile.id, obj);

                         i++;
                    });
               };
          });

          socket.on('add user', (profile) => {
               users.push(profile);
          });

          socket.on('join room', (room) => {
               socket.join(room.name);
               rooms.push(room);
          });

          socket.on('cheak for previous chat', (room) =>{
               var messages = checkChat(room);
               io.sockets.in(room.name).emit('previous chat', room.otheruserid, messages);
          });

          socket.on('send msg', (msg, room, user) => {
               var message = saveChat(msg, room.otheruserid, user);
               io.sockets.in(room.name).emit('recieve msg', message, user);
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
