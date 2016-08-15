(function() {
    'use strict';
    angular
        .module('consccreserva.controller', [])
        .controller('ConsCCReservasCtrl', ConsCCReservasCtrl);

    ConsCCReservasCtrl.$inject = ['$rootScope', '$scope', '$state', 'ReservaService', '$filter', '$ionicLoading', '$ionicNavBarDelegate'];
    function ConsCCReservasCtrl($rootScope, $scope, $state, ReservaService, $filter, $ionicLoading, $ionicNavBarDelegate) {


      $scope.search = {value: ""};

      $scope.editarReserva = function(reserva) {
        $state.go('editar/reserva', {reserva: reserva });
      }

      $scope.pesquisarCC = function() {
        console.log($scope.search.value);

        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });

        ReservaService.consultarReservasCC($scope.search.value)
          .then(
            function(data) {
                $scope.reservas = data.object;
                if($scope.reservas == null) {
                  setTimeout(function () {
                    $scope.$apply(function(){
                      $scope.error = data.message;
                    });
                  }, 1000);
                }
                setTimeout(function () {
                  $ionicLoading.hide();
                },1500);
            },
            function(error) {
                $scope.error = "Carregue a página novamente";
                setTimeout(function () {
                  $ionicLoading.hide();
                },1500);
            }
          );

      }

      $scope.back = function() {
        $ionicNavBarDelegate.back();
      }

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
          viewData.enableBack = true;
      });

      $scope.backConsReserva = function() {
        $state.go('gerenciar/reserva');
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

      $scope.backToMain = function() {
        $state.go("main");
      }



    };
})();
