(function() {
    angular
        .module('settings.controller', [])
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$scope', '$scope', '$state','$ionicPopup', '$rootScope', '$ionicLoading'];
    function SettingsCtrl
    ($scope, $scope, $state, $ionicPopup, $rootScope) {
      var myPopup;

      $scope.mesas = function() {
        $state.go('mesas');
      }
      $scope.checkin = function() {
          myPopup = $ionicPopup.show({
            template: '<button class="button button-outline button-positive button-checkin" ng-click="semReserva()">Sem Reserva</button> \
            <button class="button button-outline button-positive button-checkin" ng-click="comReserva()">Com reserva</button>',
            title: 'Ações',
            subTitle: 'O cliente já tem reserva?',
            scope: $scope,
            buttons: [
              { text: 'Fechar' }
            ]
          });
      }

      $scope.semReserva = function() {
        console.log("teste")
        $state.go('checkin');
      }

      $scope.comReserva = function() {
        console.log("teste")
        $state.go('checkin');
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

      $scope.relatorios = function() {
        $state.go('relatorio');
      }

      $scope.detalhes = function() {
        $state.go('detalhes');
      }

      $rootScope.toggleItem= function(item) {
         if ($scope.isItemShown(item)) {
           $scope.shownItem = null;
         } else {
           $scope.shownItem = item;
         }
       };

      $rootScope.isItemShown = function(item) {
         return $scope.shownItem === item;
      };
    };


})();
