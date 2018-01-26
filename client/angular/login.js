myapp.controller('loginCtrl', ['$http','$state',  function ($http, $state) {
     var self = this;
     self.error = ' ';


     self.login = function (){
          self.error = undefined;
          if (self.lemail === 'Email' || self.lpassword === 'password'){
               self.error = 'Please enter valid Email id and password.';
               self.lemail = '';
               self.lpassword = '';
          } else {
               var data = { email: self.lemail, password: self.lpassword};
               $http.post('http://localhost:3000/server/login', data).then(function successCallback(response){


                    if (response.data.error === true) {
                         if (response.data.status === 404) {
                              self.lemail = '';
                              self.lpassword = '';
                              self.error = "Email Id or Password is incorrect.";
                         }else if (response.data.status === 500) {
                              self.lemail = '';
                              self.lpassword = '';
                              self.error = "Server is down. Please try after some time.";
                         }else if (response.data.status === 403) {
                              self.lemail = '';
                              self.lpassword = '';
                              self.error = "Required parameteris missing";
                         }else {
                              self.lemail = '';
                              self.lpassword = '';
                              self.error = "Some error is haulting the request. Please Try again after some time. We are working on this.";
                         };
                    }else if (response.data.error === false) {
                         $state.go('chat');
                    };
               },function errorCallback(response){
                    self.lemail = '';
                    self.lpassword = '';
                    self.error = "Server is down. Please try after some time.";
               });
          };
     };

     self.register = function () {
          var letters = /^[A-Za-z]+$/;
          var letterNumber = /^[0-9a-zA-Z]+$/;
          var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          var number = /[0-9]/;
          var lowercase = /[a-z]/;
          var uppercase = /[A-Z]/;
          self.rerror = undefined;
          self.firstnameerror = undefined;
          self.lastnameerror = undefined;
          self.usernameerror = undefined;
          self.emailerror = undefined;
          self.passworderror = undefined;
          self.confirmpassworderror = undefined;
          if (self.email === ' ' || self.password === ' ' || self.firstName === ' ' || self.lastName === ' ' || self.username === ' '){
               self.rerror = 'Please enter valid Email id and password.';
          }else if (self.email === 'email' || self.password === 'password' || self.firstName === 'firstName' || self.lastName === 'lastName' || self.username === 'username'){
               self.rerror = 'Please enter valid Email id and password.';
          }else if (!self.firstName.match(letters)) {
               self.firstnameerror = " Please use only alphabet characters.";
          }else if (!self.lastName.match(letters)) {
               self.lastnameerror = " Please use only alphabet characters.";
          }else if (!self.username.match(letterNumber)) {
               self.usernameerror = " Please use only alphabet characters and numbers.";
          }else if (!self.email.match(mailformat)) {
               self.emailerror = " Please use valid email address.";
          }else if (self.password.length < 8) {
               self.passworderror = " Please use password greater or equal to 8 characters.";
          }else if (!self.password.match(number)) {
               self.passworderror = " Please use password with at least one numerical character.";
          }else if (!self.password.match(lowercase)) {
               self.passworderror = " Please use password with at least one lowercase alphabatic character.";
          }else if (!self.password.match(uppercase)) {
               self.passworderror = " Please use password with at least one uppercase alphabatic character.";
          }else if (self.password != self.confirmpassword) {
               self.confirmpassworderror = 'The password do not match. Please type again.';
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
