myapp.service('chat', ['$http', function($http) {
     var self =  this;
     self.messages;

     self.getChat = (room, callback) => {
          var user1 = room.subscribers[0];
          var user2 = room.subscribers[1];
          $http.get('http://localhost:3000/server/getchat?user1='+ user1 + '&user2=' + user2).then( function successCallback(response){
               if (response.data.error === true) {
                    console.log("Some error have accured during fetching previous chat.");
               }else if (response.data.error === false) {
                    self.messages = response.data.data;
                    callback(self.messages);
               };
          }), function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          };
     }

     self.saveChat = (message, recieverid, senderid) => {console.log(2);
          var data = { msg: message, reciever: recieverid, sender: senderid};
          $http.post('http://localhost:3000/server/savechat', data).then(function successCallback(response){
               if (response.data.error === true) {
                    console.log("Server is down. Please try after some time.");
               }
          },function errorCallback(response){
               console.log("Can not connect to server. Please try after some time.");
          });
     }
}]);
