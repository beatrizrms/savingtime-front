(function() {
    'use strict';
    angular
        .module('reserva.service', [])
        .factory('ReservaService', ReservaService);

    ReservaService.$inject = ['$http', '$q'];
    function ReservaService($http, $q) {

      var host = 'http://usjt-savingtime.rhcloud.com/';
      //var host = 'http://localhost:8080/usjt/';

        var reservasMethods = {
            cadastrarReserva : cadastrarReserva,
            consultarReservas: consultarReservas,
            consultarReservasData: consultarReservasData,
            consultarReservasCC: consultarReservasCC,
            editarReserva: editarReserva,
            cancelarReserva: cancelarReserva,
            categorias: categorias,
            obterComprovante: obterComprovante,
            verificarDisponibilidade: verificarDisponibilidade
        };

        return reservasMethods;


        function cadastrarReserva(reserva){

          var deferred = $q.defer();

          $http({
             method: 'POST',
             url: host + 'reservarest/cadastrar/reserva',
             data: reserva,
             headers: {'Content-Type': 'application/json'}
          }, {timeout: 10000}).success(function (data, status, headers, config) {
            deferred.resolve(data);
          }).error(function (data, status, headers, config) {
             deferred.reject(data);
          });
            return deferred.promise;
        }

        function verificarDisponibilidade(reserva){

          var deferred = $q.defer();

          $http({
             method: 'POST',
             url: host + 'disponibilidaderest/disponibilidade/reserva',
             data: reserva,
             headers: {'Content-Type': 'application/json'}
          }, {timeout: 10000}).success(function (data, status, headers, config) {
            deferred.resolve(data);
          }).error(function (data, status, headers, config) {
             deferred.reject(data);
          });
            return deferred.promise;
        }

        function consultarReservas() {
          var deferred = $q.defer();
          $http.get(host + 'reservarest/consultar/reservas', {timeout: 10000})
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        };

        function categorias(quantidade) {
          var deferred = $q.defer();
          $http.get(host + 'atendimentorest/get/tipo/evento/'+quantidade, {timeout: 10000})
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        }

        function obterComprovante(codigo) {
          var deferred = $q.defer();
          $http.get(host + 'reservarest/obter/comprovante/'+codigo, {timeout: 10000})
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        }

        function consultarReservasData(dataInicio, dataFinal){
          console.log(dataInicio + " " + dataFinal)
          var deferred = $q.defer();
          $http.get(host + 'reservarest/consultar/reserva/data/' + dataInicio + '/' + dataFinal, {timeout: 10000})
          .success(function(data) {
            deferred.resolve(data);
          }).error(function(data) {
            deferred.reject(data);
          });

          return deferred.promise;
        }

        function consultarReservasCC(cpf) {
          var deferred = $q.defer();
          console.log(cpf.length)
          if(cpf.length == 11) {
            $http.get(host + 'reservarest/consultar/reserva/cpf/' + cpf, {timeout: 10000})
            .success(function(data) {
              console.log(data);
              deferred.resolve(data);
            }).error(function(data) {
              deferred.reject(data);
            });
          } else {
            var codigo = cpf;
            $http.get(host + 'reservarest/consultar/reserva/codigo/' + codigo, {timeout: 10000})
            .success(function(data) {
              console.log(data);
              deferred.resolve(data);
            }).error(function(data) {
              deferred.reject(data);
            });
          }
          return deferred.promise;
          }

        function cancelarReserva(cod) {
          var deferred = $q.defer();
          $http.get(host + 'reservarest/cancelar/reserva/' + cod, {timeout: 10000})
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
          }, {timeout: 10000}).success(function (data, status, headers, config) {
            deferred.resolve(data);
          }).error(function (data, status, headers, config) {
             deferred.reject(data);
          });
            return deferred.promise;

        }


    }
})();
