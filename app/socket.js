module.exports.controller = (server) => {

     var io = require('socket.io').listen(server);
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

          socket.on('send msg', (data) => {
               var message = {
                    msg: data.msg,
                    sentOn: Date.now(),
                    sentBy: data.user.firstname + " " + data.user.lastname
               };
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
