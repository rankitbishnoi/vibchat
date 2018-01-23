myapp.controller('chatCtrl', ['user','$state','socket', function(user, $state, socket) {

     var self = this;
     var profile;
     self.users = [];
     self.recievingUser = { name: 'Vibchat', image: 'http://dummyimage.com/250x250/000/fff&text=V', status: true};
     self.chatbox = [];
     self.chatroom;
     self.msg = "Type your message here";
     user.then((data) =>{
          profile = data;
          if (profile === undefined || profile === null) {
               $state.go('login');
          }
          self.profileName = profile.firstname + " " + profile.lastname;
          self.profileImage = 'https://dummyimage.com/600x400/9e989e/000105.gif&text=' + profile.firstname.charAt(0).toUpperCase();

          self.checkCreateRoom();
          self.adduser();

     });

     self.checkCreateRoom = () => {
          socket.emit('check and create room', profile);
     };

     self.adduser = () => {
          socket.emit('add user', profile);
     };

     socket.on('new user online', (userid, room) => {
          if (userid === profile._id) {
               room.msgcount = 0;
               room.status = true;
               room.typing = false;
               users.push(room);
          };
          self.joinroom(room);
     });

     self.joinroom = (room) => {
          socket.emit('join room', room);
     };

     self.chatinroom = (room) => {
          self.recievingUser.name = room.otheruser;
          self.recievingUser.image = 'http://dummyimage.com/250x250/000/fff&text=' + room.otheruser.charAt(0).toUpperCase();
          self.recievingUser.status = room.status;
          self.checkForPreviousChat(room);
          self.chatroom = room;

          var i;
          self.users.forEach((user,index) => {
               if(user.otheruserid === room.otheruserid) {
                    i = index;
               }
          });
          self.users[i].msgcount = 0;

     };

     self.checkForPreviousChat = (room) =>{
          socket.emit('check for previous chat', room);
     };

     socket.on('previous chat', (otheruserid, messages) => {
          self.chatbox = [];
          if(profile._id != otheruserid && messages[0] != null && messages[0] != undefined) {
               messages[0].chat.forEach((msg)=> {
                    self.chatbox.push(msg);
               });
          };
     });

     self.sendmsg = () => {
          if (self.msg != null && self.msg != undefined){
               socket.emit('send msg', self.msg, self.room, profile);
          }
          self.msg = "";
     };

     socket.on('recieve msg', (msg, sentBy) =>{
          var name = sentBy.firstname + " " + sentBy.lastname;
          if (self.recievingUser.name != name) {
               var i;
               self.users.forEach((user,index) => {
                    if(user.otheruserid === sentBy._id) {
                         i = index;
                    }
               });
               self.users[i].msgcount += 1;
          }else {
               self.chatbox.push(msg);
          }
     });


     var inputChangedPromise;
     var typingIndex;
     const task = ()=> {
          socket.emit('user stopped typing', profile.id);
          typingIndex = false;
     }
     self.typing = () => {
          if(typingIndex != true){ socket.emit('user started typing', profile.id); typingIndex = true};
          if(inputChangedPromise){
               $timeout.cancel(inputChangedPromise);
          }
          inputChangedPromise = $timeout(task(),1000);
     }

     socket.on('user is typing', (userid) => {
          var i;
          self.users.forEach((user,index) => {
               if(user.otheruserid === userid) {
                    i = index;
               }
          });
          self.users[i].typing = true;
     });

     socket.on('user stopped', (userid) => {
          var i;
          self.users.forEach((user,index) => {
               if(user.otheruserid === userid) {
                    i = index;
               }
          });
          self.users[i].typing = false;
     });

     socket.on('user offline', (list) => {
          var offlineroom, i;
          list.forEach((room) => {
               if(room.otheruserid === profile._id) {
                    offlineroom = room.name;
               }
          });

          self.users.forEach((user, index) => {
               if (user.name === offlineroom) {
                    i = index;
               }
          });

          self.users[i].status = false;
          if (self.recievingUser.name === self.users[i].otheruser) {
               var msg = { msg: self.recievingUser.name + " has gone offline", sentOn: Date.now(), sentBy: " "}
               self.chatbox.push(msg);
               self.recievingUser.status = false;
          }
     });
}]);

/* Services */
myapp.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
