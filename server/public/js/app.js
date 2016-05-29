var app = angular.module('pricescribe', ['ngRoute', 'pricescribeControllers', 'psApiServices']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        }).
        when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        }).
        when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'SignupController'
        }).
        when('/dashboard', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardController'
        }).
        when('/addreceipt', { // view for adding, removing, modifying receipt you upload. 
            templateUrl: 'partials/addreceipt.html',
            controller: 'AddReceiptController'
        }).
        otherwise({
            redirectTo: '/home'
        });
}])
.run(function($rootScope, $location, $route, sessionStore) {
    // redirects a user if they haven't logged into the app yet
    $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
            console.log($location.path());
            if (sessionStore.getSession().length == 0 && ($location.path() !== '/home' 
                && $location.path() !== '/login' && $location.path() !== '/signup')) {
                $location.path('/login');
            }
            if (($location.path() == '/home' || $location.path() == '/signup' || $location.path() == '/login')
              && sessionStore.getSession().length > 0) {
                $location.path('/dashboard');
            }
    });
});