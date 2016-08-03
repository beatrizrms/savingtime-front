(function() {
    'use strict';
    angular
        .module('reserva.controller', [])
        .controller('ReservaCtrl', ReservaCtrl);

    ReservaCtrl.$inject = ['$rootScope', '$scope', '$state'];
    function ReservaCtrl($rootScope, $scope, $state) {


      $scope.efetuarReserva = function() {
        $state.go('reserva');
      }

      $scope.consultarReserva = function() {
        $state.go('consultar/reserva');
      }
    };
})();
