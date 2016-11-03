(function() {
    angular
        .module('main.controller', [])
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', '$scope', '$state','$ionicPopup', '$rootScope', 'MainService'];
    function MainCtrl($scope, $scope, $state, $ionicPopup, $rootScope, MainService) {
      var myPopup;


      getHome();


      $scope.settings = function() {
        $state.go('settings');
      }

      $scope.help = function() {
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
        setInterval(function(){
          getHome();
         },
        1500);
      });

    }

})();
