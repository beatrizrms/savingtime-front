(function() {
    'use strict';
    angular
        .module('cadmesas.controller', [])
        .controller('CadMesasCtrl', CadMesasCtrl);

    CadMesasCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'MesasService', '$ionicLoading'];
    function CadMesasCtrl($rootScope, $scope, $state, $ionicPopup, MesasService, $ionicLoading) {

      $scope.mesa = { codigo: 0,
                      numMesa: '',
                      status: '',
                      capacidade: ''
                    };


      $scope.cadastrarMesa = function() {

         var confirmPopup = $ionicPopup.confirm({
           title: 'Cadastrar Mesas',
           template: 'Você tem certeza ?'
         });

         confirmPopup.then(function(res) {
           if(res) {
             cadastrarMesa();
           }
         });
      }

      function cadastrarMesa() {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });
        MesasService.cadastrarMesa($scope.mesa)
          .then(
            function(data) {
                $scope.showAlert(data.message);
                $scope.mesa = { codigo: 0,
                                numMesa: '',
                                status: '',
                                capacidade: ''
                              };
                $ionicLoading.hide();
            },
            function(error) {
                $scope.showAlert("Tente novamente");
                $ionicLoading.hide();
            }
          );
      }


      $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
          title: '',
          template: msg
        });
      }

      $scope.backCadMesas = function() {
        $state.go("mesas");
      }

    };
})();
