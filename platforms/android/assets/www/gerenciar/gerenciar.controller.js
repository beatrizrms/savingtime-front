(function() {
    'use strict';
    angular
        .module('gerenciar.controller', [])
        .controller('GerenciarCtrl', GerenciarCtrl);

    GerenciarCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup'];
    function GerenciarCtrl($rootScope, $scope, $state, $ionicPopup) {

      var myPopup;

      $scope.mesas = function() {
        $state.go('mesas');
      }
      $scope.checkin = function() {
          myPopup = $ionicPopup.show({
            template: '<button class="button button-outline button-stable button-checkin" ng-click="semReserva()">Sem Reserva</button><br/> \
            <br/><button class="button button-outline button-stable button-checkin" ng-click="comReserva()">Com reserva</button>',
            title: 'Ações',
            subTitle: 'O cliente já tem reserva?',
            scope: $scope,
            buttons: [
              { text: 'Fechar' }
            ]
          });
      }

      $scope.semReserva = function() {
        myPopup.close();
        $state.go('checkin');
      }

      $scope.comReserva = function() {
        myPopup.close();
        $state.go('checkin/comreserva');
      }

      $scope.filaespera = function() {
        $state.go('filaespera');
      }
      $scope.filaatendimento = function() {
        $state.go('filaatendimento');
      }
      $scope.consultarmesas = function() {
        $state.go('consultarmesas');
      }

      $scope.gerenciar = function() {
        $state.go('gerenciar');
      }

      $scope.verdisponibilidade = function() {
        $state.go('disponibilidade');
      }

      $scope.gerenciarReserva = function() {
        $state.go('gerenciar/reserva');
      }

      $scope.backAtend = function() {
        $state.go("main");
      }

    };


})();
