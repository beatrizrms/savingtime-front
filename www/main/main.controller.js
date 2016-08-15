(function() {
    angular
        .module('main.controller', [])
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', '$scope', '$state','$ionicPopup', '$rootScope'];
    function MainCtrl($scope, $scope, $state, $ionicPopup, $rootScope) {
      var myPopup;

      $scope.settings = function() {
        $state.go('settings');
      }

      $scope.help = function() {
        $state.go('onboarding');
      }

    }

})();
