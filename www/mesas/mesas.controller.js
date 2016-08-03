(function() {
    'use strict';
    angular
        .module('mesas.controller', [])
        .controller('MesasCtrl', MesasCtrl);

    MesasCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'MesasService'];
    function MesasCtrl($rootScope, $scope, $state, $ionicPopup, MesasService) {

      // routes

      $scope.cadastrarMesa = function() {
        $state.go("cadmesas");
      }

      $scope.consultarMesa = function() {
        $state.go("tab/todasmesas");
      }

      $scope.backToMain = function() {
        $state.go("main");
      }

    };

})();
