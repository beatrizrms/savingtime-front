(function() {
    'use strict';
    angular
        .module('consultarmesas.controller', [])
        .controller('ConsultarmesasCtrl', ConsultarmesasCtrl);

    ConsultarmesasCtrl.$inject = ['$rootScope', '$scope', '$state'];
    function ConsultarmesasCtrl($rootScope, $scope, $state) {

      $scope.listmesasdisp = [
        {"num":"1453","status":"Ativo", "capacidade": 1},
        {"num":"1355","status":"Ativo", "capacidade": 10},
        {"num":"0393","status":"Ativo", "capacidade": 15},
        {"num":"3932","status":"Ativo", "capacidade": 4},
        {"num":"2939","status":"Inativo", "capacidade": 8},
        {"num":"1234","status":"Inativo", "capacidade": 2}];

    };


})();
