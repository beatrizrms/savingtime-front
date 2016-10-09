(function() {
    'use strict';
    angular
        .module('constodasreserva.controller', [])
        .controller('ConsTodasReservasCtrl', ConsTodasReservasCtrl);

    ConsTodasReservasCtrl.$inject = ['$rootScope', '$scope', '$state', 'ionicDatePicker', 'ReservaService', '$filter', '$ionicActionSheet', '$ionicLoading', '$ionicNavBarDelegate', '$ionicModal'];
    function ConsTodasReservasCtrl($rootScope, $scope, $state, ionicDatePicker, ReservaService, $filter, $ionicActionSheet, $ionicLoading, $ionicNavBarDelegate, $ionicModal) {

    var vm = this;
    $scope.reserva ={};
    
    $ionicLoading.show({
      template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
    });


    ReservaService.consultarReservas()
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

      $scope.editarReserva = function(reserva) {
        $state.go('editar/reserva', {reserva: reserva });
      }

      $scope.excluirReserva = function() {
        $state.go('reserva');
      }

      $scope.doRefresh = function() {
        ReservaService.consultarReservas()
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
                $ionicLoading.hide();
            },
            function(error) {
                $scope.error = "Carregue a página novamente";
                $ionicLoading.hide();
            }
          );
         $scope.$broadcast('scroll.refreshComplete');
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


    };
})();
