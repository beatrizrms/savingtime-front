(function() {
    'use strict';
    angular
        .module('detalhes.controller', [])
        .controller('DetalhesCtrl', DetalhesCtrl);

    DetalhesCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'DetalhesService', '$ionicLoading'];
    function DetalhesCtrl($rootScope, $scope, $state, $ionicPopup, DetalhesService, $ionicLoading) {

      DetalhesService.getDados()
        .then(
          function(data) {
            console.log(data)
            $scope.detalhes = data;
          },
          function(error) {
            $scope.error = "Carregue a página novamente";
          }
        );

    };
})();
