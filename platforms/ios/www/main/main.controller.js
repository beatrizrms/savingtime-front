(function() {
    angular
        .module('main.controller', [])
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', '$scope', '$state','$ionicPopup', '$rootScope', 'MainService'];
    function MainCtrl($scope, $scope, $state, $ionicPopup, $rootScope, MainService) {
      var myPopup;

      
      MainService.getHome()
          .then(
            function(data) {
                $scope.home = data.object[0];
                 
            },
            function(error) {
                
            }
          );
      

      $scope.settings = function() {
        $state.go('settings');
      }

      $scope.help = function() {
        $state.go('onboarding');
      }

    }

})();
