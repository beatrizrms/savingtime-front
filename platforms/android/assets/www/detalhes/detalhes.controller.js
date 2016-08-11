(function() {
    'use strict';
    angular
        .module('detalhes.controller', [])
        .controller('DetalhesCtrl', DetalhesCtrl);

    DetalhesCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'DetalhesService', '$ionicLoading'];
    function DetalhesCtrl($rootScope, $scope, $state, $ionicPopup, DetalhesService, $ionicLoading) {

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
      });
      DetalhesService.getDados()
        .then(
          function(data) {
            console.log(data)
            $scope.detalhes = data;
              $ionicLoading.hide();
          },
          function(error) {
            $scope.error = "Carregue a página novamente";
          }
        );

    };
})();
