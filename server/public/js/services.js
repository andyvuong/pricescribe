var psApiServices = angular.module('psApiServices', []);

// service for handling api requests to our server
psApiServices.factory('psApi', function($http, $window) {

    var url = '/api/';
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