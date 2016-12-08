(function() {
    'use strict';
    angular
        .module('consccreserva.controller', [])
        .controller('ConsCCReservasCtrl', ConsCCReservasCtrl);

    ConsCCReservasCtrl.$inject = ['$rootScope', '$scope', '$state', 'ReservaService', '$filter', '$ionicLoading', '$ionicNavBarDelegate', '$ionicModal', '$ionicPopup'];
    function ConsCCReservasCtrl($rootScope, $scope, $state, ReservaService, $filter, $ionicLoading, $ionicNavBarDelegate, $ionicModal, $ionicPopup) {

      $scope.reserva ={};
      $scope.search = {value: ""};

      $scope.editarReserva = function(reserva) {
        $state.go('editar/reserva', {reserva: reserva });
      }

      $scope.pesquisarCC = function() {
        console.log($scope.search.value);

        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });

        loadReservas(true);
      };

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

        $scope.$on("$ionicView.enter", function() {
          if($scope.search.value){
            loadReservas(false);
          }
        });

        function loadReservas(notFirst) {
          ReservaService.consultarReservasCC($scope.search.value)
            .then(
              function(data) {
                  $scope.reservas = data.object;
                  console.log($scope.reservas);
                  if($scope.reservas == null) {
                    if(notFirst) {
                      setTimeout(function () {
                        $scope.$apply(function(){
                          $scope.showAlert("Reserva não encontrada");
                          $scope.error = data.message;
                        });
                      }, 1000);
                    }
                  }
                  setTimeout(function () {
                    $ionicLoading.hide();
                  },1500);
              },
              function(error) {
                console.log("DERU MERDA")
                if(error.status == "NOT_FOUND") {
                  $scope.showAlert("Reserva não encontrada");
                } else {
                  $scope.error = "Carregue a página novamente";
                  setTimeout(function () {
                    $ionicLoading.hide();
                  },1500);
                }
              }
            );
        }

        $scope.showAlert = function(msg) {
          var alertPopup = $ionicPopup.alert({
            title: '',
            template: msg
          });
        }

    };
})();
