(function() {
    'use strict';
    angular
        .module('mesas.service', [])
        .factory('MesasService', MesasService);

    MesasService.$inject = ['$http', '$q'];
    function MesasService($http, $q) {

      var host = 'http://usjt-savingtime.rhcloud.com/';
      //var host = 'http://localhost:8080/usjt/';

        var mesasMethods = {
            cadastrarMesa : cadastrarMesa,
            editarMesa : editarMesa,
            consultarMesas: consultarMesas,
            consultarMesasCapacidade: consultarMesasCapacidade,
            consultarMesasStatus: consultarMesasStatus,
            consultarStatusMesa: consultarStatusMesa
        };

        return mesasMethods;


        function cadastrarMesa(mesa){

          var deferred = $q.defer();

          $http({
             method: 'POST',
             url: host + 'mesarest/cadastrar/mesa',
             data: mesa,
             headers: {'Content-Type': 'application/json'}
          }, {timeout: 10000}).success(function (data, status, headers, config) {
            deferred.resolve(data);
          }).error(function (data, status, headers, config) {
             deferred.reject(data);
          });
            return deferred.promise;

        }

        function consultarMesas() {
          var deferred = $q.defer();
          $http.get(host + 'mesarest/consultar/mesas', {timeout: 10000})
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        };

        function editarMesa(mesa){

          var deferred = $q.defer();
          $http({
             method: 'POST',
             url: host + 'mesarest/alterar/mesa',
             data: mesa,
             headers: {'Content-Type': 'application/json'}
          }, {timeout: 10000}).success(function (data, status, headers, config) {
            deferred.resolve(data);
          }).error(function (data, status, headers, config) {
             deferred.reject(data);
          });
            return deferred.promise;

        }

        function consultarMesasCapacidade(capacidade) {
          var deferred = $q.defer();
          $http.get(host + 'mesarest/consultar/mesas/capacidade/'+capacidade, {timeout: 10000})
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        }

        function consultarMesasStatus(status){
          var deferred = $q.defer();
          $http.get(host + 'mesarest/consultar/mesas/status/'+status, {timeout: 10000})
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        }

        function consultarStatusMesa(){
          var deferred = $q.defer();
          $http.get(host + 'mesarest/get/status/mesa', {timeout: 10000})
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        }

    }
})();
