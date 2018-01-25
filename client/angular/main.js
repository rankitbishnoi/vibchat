myapp.controller('mainCtrl', [function() {
     var self = this;
     self.usertab = 'user';
     self.chattab = 'hidden-xs hidden-sm';
     var a = 'hidden-xs hidden-sm';

     self.changeclass = (input)=> {
          if (input === 'user') {
               self.usertab = 'user';
               self.chattab = 'hidden-xs hidden-sm';
          }else if (input === 'chat') {
               self.usertab = 'hidden-xs hidden-sm';
               self.chattab = 'chat';
          }
     }
}]);
