var pricescribeMobileControllers = angular.module('pricescribeMobileControllers', ['ngFileUpload', 'chart.js']);

pricescribeMobileControllers.controller('HomeController', ['$scope', '$window', 'psApi', '$location', 'sessionStore', function($scope, $window, psApi, $location, sessionStore) {
    $scope.loginInfo = {
        email: '',
        password: ''
    }

    $scope.alert = '';

    $scope.displayError = function(msg) {
        $scope.alert = msg;
    };

    /**
     * Performs form validation before querying the database and logging the user in.
     */
    $scope.login = function() {
        if (typeof $scope.loginInfo.email === 'undefined') {
            $scope.displayError("Please enter a valid email address!");
        }
        else if ($scope.loginInfo.email.length == 0 || $scope.loginInfo.password.length == 0) {
            $scope.displayError("Please enter the required fields!");
        }
        else {
            var params = {
                email: $scope.loginInfo.email,
                password: $scope.loginInfo.password
            }; 

            psApi.post('access/login', params)
                .success(function(data) {
                    sessionStore.setSession(data.data); 
                    $location.path('/addreceipt');
                })
                .error(function(data) {
                    $scope.displayError(data.message);
                });
        }
    }    
   
}]);

pricescribeMobileControllers.controller('SignupController', ['$scope', '$window', 'psApi', '$location', function($scope, $window, psApi, $location) {
    $scope.signupInfo = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: ''
    }
    
    $scope.alert = '';

    $scope.displayError = function(msg) {
        $scope.alert = msg;
    };

    /**
     * Performs form validation before querying the database and creating a new user.
     */
    $scope.submit = function() {
        if (typeof $scope.signupInfo.email === 'undefined') {
            $scope.signupInfo.displayError("Please enter a valid email address!");
        }
        else if ($scope.signupInfo.firstName.length == 0 || $scope.signupInfo.lastName.length == 0 
            || $scope.signupInfo.email.length == 0 || $scope.signupInfo.password == 0 || $scope.signupInfo.repeatPassword == 0) {
            $scope.signupInfo.displayError("Please enter the required fields!");
        }
        else if ($scope.signupInfo.password !== $scope.signupInfo.repeatPassword) {
            $scope.signupInfo.displayError("Passwords do not match!");
        }
        else {
            var params = {
                firstName: $scope.signupInfo.firstName,
                lastName: $scope.signupInfo.lastName,
                email: $scope.signupInfo.email,
                password: $scope.signupInfo.password
            };

            psApi.post('user', params)
                .success(function(data) {
                    console.log(data.message);
                    $location.path('/login');
                })
                .error(function(data) {
                    $scope.displayError(data.message);
                });
        }
    };
   
}]);

pricescribeMobileControllers.controller('AddReceiptController', ['$scope', '$window', 'cameraModule', '$cordovaCamera', '$cordovaFileTransfer', 'sessionStore', 'psApi', function($scope, $window, cameraModule, $cordovaCamera, $cordovaFileTransfer, sessionStore, psApi) {
    $scope.status = '';
    $scope.alert = '';
    var url = 'http://localhost:3000/api/receipt';

    $scope.takePicture = function (options) {
        cameraModule.takePhoto(sessionStore.getSession());
    };
    
    /**
     * Opens the gallery for the user to choose an image to upload and send to the server.
     */
    $scope.getPicture = function (options) {
        cameraModule.getPhoto(sessionStore.getSession());
    }; 


    // loads the user data
    function getUserData() {
        var params = {
            userId: sessionStore.getSession()
        };
        psApi.get('receipt', params)
            .success(function(data) {
                $scope.receiptData = data.data;

                // set visualization data
                $scope.data = [[]];
                $scope.series = ['Receipts'];
                $scope.labels = [];
                $scope.statsTotal = 0;
                var i = 0;
                for (; i < data.data.length; i++) {
                    $scope.statsTotal += $scope.receiptData[i].total;
                    $scope.data[0].push(parseInt($scope.receiptData[i].total));
                    $scope.labels.push('R' + i.toString());
                }
                $scope.statsAverage = $scope.statsTotal / i;
                $scope.statsCount = i;
                
                process();
            })  
            .error(function(data) {
                console.log('Error getting data.');
            });
    }

    // processes the user data for display
    function process() {
        // get the most recent data
        $scope.recent = $scope.receiptData[$scope.receiptData.length-1];
        $scope.recentDate = (new Date($scope.receiptData[$scope.receiptData.length-1].created_at)).toDateString();
        $scope.recentPrice = $scope.receiptData[$scope.receiptData.length-1].total;
        $scope.currentDay = (new Date()).toDateString();
    }

    getUserData();

}]);