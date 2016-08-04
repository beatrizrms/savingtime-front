(function() {
    'use strict';
    angular
        .module('disponibilidade.controller', [])
        .controller('DisponibilidadeCtrl', DisponibilidadeCtrl);

    DisponibilidadeCtrl.$inject = ['$rootScope', '$scope', '$state', 'ReservaService', '$ionicLoading'];
    function DisponibilidadeCtrl($rootScope, $scope, $state, ReservaService, $ionicLoading) {

      $scope.categoria = false;
      $scope.disp = [];

      $scope.showCategoria = function(quantidade) {
        $ionicLoading.show();
        $scope.categoria = false;
        if(quantidade !== '' && quantidade !== undefined && quantidade !== null)
        ReservaService.categorias(quantidade)
          .then(
            function(data) {
                console.log(data);
                if (data.length > 0) {
                  $scope.categoria = true;
                  $scope.listcategorias = data;
                }

                $ionicLoading.hide();

            },
            function(error) {
                $scope.showAlert("Tente novamente");
                $ionicLoading.hide();
            }
          );
      }

    };


})();
