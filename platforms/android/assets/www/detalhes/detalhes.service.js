(function() {
    'use strict';
    angular
        .module('detalhes.service', [])
        .factory('DetalhesService', DetalhesService);

    DetalhesService.$inject = ['$http', '$q'];
    function DetalhesService($http, $q) {

      //var host = 'http://usjt-savingtime.rhcloud.com/';
      var host = 'http://localhost:8080/usjt/';

        var detalhesMethods = {
            getDados : getDados
        };

        return detalhesMethods;


        function getDados() {
          var deferred = $q.defer();
          $http.get(host + 'estabelecimentorest/get/dados/estabelecimento')
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        };

    }
})();
