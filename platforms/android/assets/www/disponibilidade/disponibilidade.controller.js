(function() {
    'use strict';
    angular
        .module('disponibilidade.controller', [])
        .controller('DisponibilidadeCtrl', DisponibilidadeCtrl);

    DisponibilidadeCtrl.$inject = ['$rootScope', '$scope', '$state'];
    function DisponibilidadeCtrl($rootScope, $scope, $state) {


      $scope.backDisp= function() {
        $state.go('main');
      }

    };


})();
