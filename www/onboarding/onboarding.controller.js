(function() {
    'use strict';
    angular
        .module('onboarding.controller', [])
        .controller('OnboardingController', OnboardingController);

    OnboardingController.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'MesasService'];
    function OnboardingController($rootScope, $scope, $state, $ionicPopup, MesasService) {

      localStorage.setItem('VIU_ONB', true);

    };

})();
