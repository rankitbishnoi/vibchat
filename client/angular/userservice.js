myapp.service('user', ['$http', function($http) {
     var self =  this;
     self.user = {};

     var promise = $http.get('http://localhost:3000/server/user').then(function successCallback(response){
               if (response.data.error === true) {
                    self.user = false;
               }else if (response.data.error === false) {
                    self.user = response.data.data;
               };
               return self.user;
          }, function errorCallback(response){
               self.error = "Server is down. Please try after some time.";
          });
     return promise;
}]);
