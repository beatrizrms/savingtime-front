(function() {
    'use strict';
    angular
        .module('reserva.service', [])
        .factory('ReservaService', ReservaService);

    ReservaService.$inject = ['$http', '$q'];
    function ReservaService($http, $q) {

      var host = 'http://usjt-savingtime.rhcloud.com/';

        var reservasMethods = {
            cadastrarReserva : cadastrarReserva,
            consultarReservas: consultarReservas,
            consultarReservasData: consultarReservasData,
            consultarReservasCC: consultarReservasCC,
            editarReserva: editarReserva,
            cancelarReserva: cancelarReserva
        };

        return reservasMethods;


        function cadastrarReserva(reserva){

          var deferred = $q.defer();

          $http({
             method: 'POST',
             url: host + 'reservarest/cadastrar/reserva',
             data: reserva,
             headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
            deferred.resolve(data);
          }).error(function (data, status, headers, config) {
             deferred.reject(data);
          });
            return deferred.promise;

        }

        function consultarReservas() {
          var deferred = $q.defer();
          $http.get(host + 'reservarest/consultar/reservas')
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        };




        function consultarReservasData(dataInicio, dataFinal){
          var deferred = $q.defer();
          $http.get(host + 'reservarest/consultar/reserva/data/' + dataInicio + '/' + dataFinal)
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        }

        function consultarReservasCC(cpf) {
          var deferred = $q.defer();
          $http.get(host + 'reservarest/consultar/reserva/cpf/' + cpf)
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
          }

        function cancelarReserva(cod) {
          var deferred = $q.defer();
          $http.get(host + 'reservarest/cancelar/reserva/' + cod)
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;

        }

        function editarReserva(reserva) {

          var deferred = $q.defer();

          var data = reserva.dataReserva.split('/');
          reserva.dataReserva = data[0]+ '-' + data[1]+ '-' +data[2];
          console.log(reserva)

          $http({
             method: 'POST',
             url: host + 'reservarest/alterar/reserva',
             data: reserva,
             headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
            deferred.resolve(data);
          }).error(function (data, status, headers, config) {
             deferred.reject(data);
          });
            return deferred.promise;

        }


    }
})();
