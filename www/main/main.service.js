(function() {
    'use strict';
    angular
        .module('main.service', [])
        .factory('MainService', MainService);

    MainService.$inject = ['$http', '$q'];
    function MainService($http, $q) {

      var host = 'http://usjt-savingtime.rhcloud.com/';
      //var host = 'http://localhost:8080/usjt/';


        var methods = {
            getHome : getHome
        };

        return methods;


        function getHome() {
          var deferred = $q.defer();
          $http.get(host + 'disponibilidaderest/get/dados/home', {timeout: 10000})
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            console.log(data)
            deferred.reject(data);
          });

          return deferred.promise;
        };

    }
})();
