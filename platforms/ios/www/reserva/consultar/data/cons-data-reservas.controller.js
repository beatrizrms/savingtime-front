(function() {
    'use strict';
    angular
        .module('consdatareserva.controller', [])
        .controller('ConsDataReservasCtrl', ConsDataReservasCtrl);

    ConsDataReservasCtrl.$inject = ['$rootScope', '$scope', '$state', 'ReservaService', '$filter', '$ionicLoading', '$ionicNavBarDelegate'];
    function ConsDataReservasCtrl($rootScope, $scope, $state, ReservaService, $filter, $ionicLoading, $ionicNavBarDelegate) {

      $scope.pesquisa = {
                        dataInicio: new Date(),
                        dataFinal: new Date()
                       };


      $scope.editarReserva = function(reserva) {
        $rootScope.reservaedit = reserva;
        $state.go('editar/reserva');
      }

      $scope.pesquisarData = function(reserva) {
        var dataInicio = $filter('date')($scope.pesquisa.dataInicio, 'dd-MM-yyyy', '-0300');
        var dataFinal = $filter('date')($scope.pesquisa.dataFinal, 'dd-MM-yyyy', '-0300');

        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });

        ReservaService.consultarReservasData(dataInicio, dataFinal)
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

      $scope.backToMain = function() {
        $state.go("main");
      }

    };
})();
