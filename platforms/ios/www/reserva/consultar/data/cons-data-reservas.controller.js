(function() {
    'use strict';
    angular
        .module('consdatareserva.controller', [])
        .controller('ConsDataReservasCtrl', ConsDataReservasCtrl);

    ConsDataReservasCtrl.$inject = ['$rootScope', '$scope', '$state', 'ReservaService', '$filter', '$ionicLoading', '$ionicNavBarDelegate', '$ionicModal'];
    function ConsDataReservasCtrl($rootScope, $scope, $state, ReservaService, $filter, $ionicLoading, $ionicNavBarDelegate, $ionicModal) {

      $scope.pesquisa = {
                        dataInicio: new Date(),
                        dataFinal: new Date()
                       };


      $scope.editarReserva = function(reserva) {
        $state.go('editar/reserva', {reserva: reserva });
      }

      $scope.pesquisarData = function(reserva) {
        $scope.error = null;
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

      $scope.getComprovanteAnexado = function(codReserva) {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });

        ReservaService.obterComprovante(codReserva)
          .then(
            function(data) {
                if(data.object != null) {
                  var photo = data.object[0].comprovante;
                  $scope.reserva.comprovante = photo;
                } else {
                  $scope.notcomprovante = 'Não há comprovante cadastrado!'
                }
                $scope.openModal();
                $ionicLoading.hide();
            },
            function(error) {
                $scope.showAlert("Tente novamente");
                console.log(error)
                $ionicLoading.hide();
            }
          );
        }

        $ionicModal.fromTemplateUrl('reserva/cadastrar/comprovante.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });

        $scope.openModal = function() {
          $scope.modal.show();
        };

        $scope.closeModal = function() {
          $scope.modal.hide();
        };


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
