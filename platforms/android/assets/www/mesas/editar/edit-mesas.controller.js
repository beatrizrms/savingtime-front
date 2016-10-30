(function() {
    'use strict';
    angular
        .module('editmesas.controller', [])
        .controller('EditMesasCtrl', EditMesasCtrl);

    EditMesasCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'MesasService', '$ionicNavBarDelegate', '$stateParams', '$ionicLoading', '$ionicHistory'];
    function EditMesasCtrl($rootScope, $scope, $state, $ionicPopup, MesasService, $ionicNavBarDelegate, $stateParams, $ionicLoading, $ionicHistory) {

      console.log($stateParams.mesa)

      $scope.error = '';
      $scope.edit = $stateParams.mesa;

      MesasService.consultarStatusMesa()
        .then(
          function(data) {
            $scope.statusmesa = data;
          },
          function(error) {
            $scope.error = "Carregue a página novamente";
          }
        );


      $scope.editarMesa = function() {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Editar Mesas',
          template: 'Você tem certeza ?'
        });

        confirmPopup.then(function(res) {
          if(res) {
            editarMesa();
          }
        });
      }

      function editarMesa() {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });
        var mesa = {codigo: $scope.edit.codigo, numMesa: $scope.edit.numMesa, status: $scope.edit.status, capacidade: $scope.edit.capacidade };
        console.log(mesa);
        MesasService.editarMesa(mesa)
          .then(
            function(data) {
                $ionicLoading.hide();
                $scope.showAlert(data.message);
            },
            function(error) {
                $scope.error = error;
                $ionicLoading.hide();
                $scope.showAlert("Tente novamente");
            }
        );
      }

      $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
          title: '',
          template: msg
        });

        alertPopup.then(function(){
          $ionicHistory.goBack();
        });
      }

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
          viewData.enableBack = true;
      });

  }
})();
