var pricescribeControllers = angular.module('pricescribeControllers', ['ngFileUpload', 'chart.js']);

pricescribeControllers.controller('HomeController', ['$scope', '$window', function($scope, $window) {

   
}]);

pricescribeControllers.controller('LoginController', ['$scope', '$window', 'psApi', '$location', 'sessionStore', function($scope, $window, psApi, $location, sessionStore) {
    $scope.email = '';
    $scope.password = '';

    $scope.alert = '';

    $scope.displayError = function(msg) {
        $scope.alert = msg;
    };

    // logs a new user in
    $scope.login = function() {
        if (typeof $scope.email === 'undefined') {
            $scope.displayError("Please enter a valid email address!");
        }
        else if ($scope.email.length == 0 || $scope.email.length == 0) {
            $scope.displayError("Please enter the required fields!");
        }
        else {
            var params = {
                email: $scope.email,
                password: $scope.password
            }; 

            psApi.post('access/login', params)
                .success(function(data) {
                    // returned value is the session key
                    $window.sessionStorage.sessionId = data.data;
                    sessionStore.setSession(data.data); // resets if reload
                    $location.path('/dashboard');
                })
                .error(function(data) {
                    $scope.displayError(data.message);
                });
        }
    }
   
}]);

pricescribeControllers.controller('SignupController', ['$scope', '$window', 'psApi', '$location', function($scope, $window, psApi, $location) {
    $scope.firstName = '';
    $scope.lastName = '';  
    $scope.email = '';
    $scope.password = '';
    $scope.repeatPassword = '';
    
    $scope.alert = '';

    $scope.displayError = function(msg) {
        $scope.alert = msg;
    };

    // signs  anew user up
    $scope.submit = function() {
        if (typeof $scope.email === 'undefined') {
            $scope.displayError("Please enter a valid email address!");
        }
        else if ($scope.firstName.length == 0 || $scope.lastName.length == 0 
            || $scope.email.length == 0 || $scope.password == 0 || $scope.repeatPassword == 0) {
            $scope.displayError("Please enter the required fields!");
        }
        else if ($scope.password !== $scope.repeatPassword) {
            $scope.displayError("Passwords do not match!");
        }
        else {
            var params = {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                email: $scope.email,
                password: $scope.password
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

pricescribeControllers.controller('AddReceiptController', ['$scope', '$window', 'Upload', '$http', 'sessionStore', '$location', function($scope, $window, Upload, $http, sessionStore, $location) {
    $scope.spinning = false;
    $scope.status = '';

    $scope.logoff = function() {
        sessionStore.deleteSession();
        $location.path('/login');
    }

    $scope.submit = function(){ //function to call on form submit
        $scope.spinning = true;
        if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
            $scope.upload($scope.file); //call upload function
        }
    }

    // upload on file select or drop
    $scope.upload = function (file) {

        Upload.upload({
            url: '/api/receipt',
            data: {file: file, 'id': sessionStore.getSession()}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + ' was uploaded');
            console.log(resp.data.data)
            $scope.spinning = false;
            $scope.status = 'Upload Successfully!';
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            console.log('progress: ');
        });
    };

}]);

pricescribeControllers.controller('DashboardController', ['$scope', '$window', 'sessionStore', '$location', 'psApi', function($scope, $window, sessionStore, $location, psApi) {


    $scope.logoff = function() {
        sessionStore.deleteSession();
        $location.path('/login');
    }

    // loads the current user info
    function getUser() {
        var params = {
            _id: sessionStore.getSession()
        };
        psApi.get('user', params)
            .success(function(data) {
                $scope.currentUser = data.data[0];
            })  
            .error(function(data) {
                console.log('Error getting data.');
            });
    }

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
    getUser();

}]);

