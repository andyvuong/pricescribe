var psApiServices = angular.module('psApiServices', []);

psApiServices.factory('psApi', function($http, $window) {

    var url = 'http://localhost:3000/api/';
    return {
        getId : function(route, id) {
            return $http.get(url + route + '/' + id);
        },
        get : function(route, parameters) {
            return $http.get(url + route, {params: parameters});
        },
        post : function(route, parameters) {
            return $http.post(url + route, parameters);
        },
        put : function(route, parameters, id) {
            return $http.put(url + route + '/' + id, parameters);
        },
        delete : function(route, id) {
            return $http.delete(url + route + '/' + id);
        }
    };
});

// service for storing a persistent session key for a logged in user
psApiServices.factory('sessionStore', function(){
    var session = '';
    return {
        setSession: function(val) {
            session = val;
        },
        getSession: function() {
            return session;
        },
        deleteSession: function() {
            session = '';
        }
    }
});

psApiServices.factory('cameraModule', function($http, $window, $cordovaCamera, $cordovaFileTransfer) {

    var url = 'http://localhost:3000/api/receipt';

    /**
     * Allows the user to choose a photo from their gallery. Once selected, the file is sent to the server.
     */
    function getImageFromGallery(id) {
        var options = {
            quality : 75,
            sourceType: 0,
            correctOrientation: true,
            encodingType: 1,
            allowEdit: true
        };

        var optionsUp = {
            params: {'id': id}  //here you can submit the data
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $cordovaFileTransfer.upload(url, imageData, optionsUp)
                                .then(function (result) {
                                    console.log('Successfully sent photo.');
                                }, function (error) {
                                    console.log('Error occured sending the photo.');
                                });

        }, function(err) {
            console.log(err);
        });
    }

    /**
     * Allows the user to take a photo with their camera. Once taken, the file is sent to the server.
     */
    function takePhotoFromCamera(id) {
        var options = {
            quality : 75,
            sourceType: 1,
            correctOrientation: true, 
            encodingType: 1,
            allowEdit: true
        };
        
        var optionsUp = {
                params: {'id': id}  //here you can submit the data
        };
        
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $cordovaFileTransfer.upload(url, imageData, optionsUp)
                                .then(function (result) {
                                    console.log('Successfully sent photo.');
                                }, function (error) {
                                    console.log('Error occured sending the photo.');
                                });
        }, function(err) {
            console.log(err);
        }); 
    }

    return {
        getPhoto : function(id) {
            getImageFromGallery(id);
        },
        takePhoto : function(id) {
            takePhotoFromCamera(id);
        }
    };

});
