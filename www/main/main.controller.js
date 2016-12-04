(function() {
    angular
        .module('main.controller', [])
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', '$scope', '$state','$ionicPopup', '$rootScope', 'MainService'];
    function MainCtrl($scope, $scope, $state, $ionicPopup, $rootScope, MainService) {
      var myPopup;

      var getHomeInterval;

      $scope.settings = function() {
        clearInterval(getHomeInterval);
        $state.go('settings');
      }

      $scope.help = function() {
        clearInterval(getHomeInterval);
        $state.go('onboarding');
      }


      $scope.doRefresh = function() {
        getHome();
      }

      function getHome() {
        MainService.getHome()
            .then(
              function(data) {
                  $scope.home = data.object[0];
                  $scope.$broadcast('scroll.refreshComplete');
              },
              function(error) {
                $scope.$broadcast('scroll.refreshComplete');
              }
            );
      }

      $scope.$on("$ionicView.enter", function() {
        getHomeInterval = setInterval(function(){
          getHome();
         },
        1500);
      });

    }

})();
