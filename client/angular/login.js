myapp.controller('loginCtrl', ['$http','$state',  function ($http, $state) {
     var self = this;
     self.error = ' ';


     self.login = function (){
          if (self.lemail === 'Email' || self.lpassword === 'password'){
               self.error = 'Please enter valid Email id and password.';
          } else {
               var data = { email: self.lemail, password: self.lpassword};
               $http.post('http://localhost:3000/server/login', data).then(function successCallback(response){


                    if (response.data.error === true) {
                         if (response.data.status === 404) {
                              self.error = "Email Id or Password is incorrect.";
                         }else if (response.data.status === 500) {
                              self.error = "Server is down. Please try after some time.";
                         }else if (response.data.status === 403) {
                              self.error = "Required parameteris missing";
                         }else {
                              self.error = "Some error is haulting the request. Please Try again after some time. We are working on this.";
                         };
                    }else if (response.data.error === false) {
                         $state.go('chat');
                    };
               },function errorCallback(response){
                    self.error = "Server is down. Please try after some time.";
               });
          };
     };

     self.register = function () {
          if (self.email === 'email' || self.password === 'password' || self.firstName === 'firstName' || self.lastName === 'lastName' || self.username === 'username'){
               self.error = 'Please enter valid Email id and password.';
          }else if (self.password != self.confirmpassword) {
               self.error = 'The password do not match. Please type again.';
          }else {
               var data = {
                    email: self.email,
                    password: self.password,
                    firstName: self.firstName,
                    lastName: self.lastName,
                    username: self.username
               };
               $http.post('http://localhost:3000/server/register', data).then(function successCallback(response){

                    if (response.data.error === true) {
                         if (response.data.status === 500) {
                              self.error = "Server is down. Please try after some time.";
                         }else if (response.data.status === 403) {
                              self.error = "Required parameteris missing";
                         }else {
                              self.error = "Some error is haulting the request. Please Try again after some time. We are working on this.";
                         };
                    }else if (response.data.error === false) {
                         $state.go('chat');
                    };
               }, function errorCallback(response){
                    self.error = "Server is down. Please try after some time.";
               });
          }
     }


}]);
