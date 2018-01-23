myapp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider

        // HOME STATES
        .state('login', {
            url: '/login',
            templateUrl: './views/loginpage.html',
            controller: "loginCtrl",
            controllerAs: 'login'
        })
        // SEARCH STATE
        .state('chat', {
            url: '/chat',
            templateUrl: './views/chatpage.html',
            controller: 'chatCtrl',
            controllerAs: 'chat'
    })
    }]);
