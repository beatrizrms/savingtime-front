(function() {
    'use strict';
    angular
        .module('relatorio.service', [])
        .factory('RelatorioService', RelatorioService);

    RelatorioService.$inject = ['$http', '$q'];
    function RelatorioService($http, $q) {

      var host = 'http://usjt-savingtime.rhcloud.com/relatoriorest';

        var relatorioMethods = {
            gerarRelatorio : gerarRelatorio
        };

        return relatorioMethods;


        function gerarRelatorio(dataInicio, dataFinal) {
          var deferred = $q.defer();
          $http.get(host + '/gerar/relatorio/'+dataInicio+'/'+dataFinal)
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        };




    }
})();
