(function() {
    'use strict';
    angular
        .module('editmesas.controller', [])
        .controller('EditMesasCtrl', EditMesasCtrl);

    EditMesasCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'MesasService', '$ionicNavBarDelegate'];
    function EditMesasCtrl($rootScope, $scope, $state, $ionicPopup, MesasService, $ionicNavBarDelegate) {

      $scope.error = '';
      $scope.edit = $rootScope.editmesa;
      $rootScope.editmesa = "";

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
        var mesa = {codigo: $scope.edit.codigo, numMesa: $scope.edit.numMesa, status: $scope.edit.status, capacidade: $scope.edit.capacidade };
        MesasService.editarMesa(mesa)
          .then(
            function(data) {
                $scope.showAlert(data.message);
            },
            function(error) {
                $scope.error = error;
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
          $state.go('mesas');
        });
      }

      $scope.back = function() {
        $ionicNavBarDelegate.back();
      }

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
          viewData.enableBack = true;
      });

  }
})();
