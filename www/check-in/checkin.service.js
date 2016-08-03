(function() {
    'use strict';
    angular
        .module('checkin.service', [])
        .factory('CheckinService', CheckinService);

    CheckinService.$inject = ['$http', '$q'];
    function CheckinService($http, $q) {

      var host = 'http://usjt-savingtime.rhcloud.com/';

        var checkinMethods = {
            consultarReserva : consultarReserva,
            efetuarCheckin: efetuarCheckin
        };

        return checkinMethods;


        function consultarReserva(busca){
          var deferred = $q.defer();

          $http({
             method: 'GET',
             url: host + 'reservarest/consultar/reserva/checkin/' + busca,
             headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
            deferred.resolve(data);
          }).error(function (data, status, headers, config) {
             deferred.reject(data);
          });
            return deferred.promise;

        }

        function efetuarCheckin(atendimento){
          var deferred = $q.defer();

          $http({
             method: 'POST',
             url: host + 'atendimentorest/efetuar/checkin',
             data: atendimento,
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
