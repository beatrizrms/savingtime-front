(function() {
    'use strict';
    angular
        .module('consmesastodas.controller', [])
        .controller('ConsMesasCtrl', ConsMesasCtrl);

    ConsMesasCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'MesasService', '$ionicLoading', '$ionicNavBarDelegate'];
    function ConsMesasCtrl($rootScope, $scope, $state, $ionicPopup, MesasService, $ionicLoading, $ionicNavBarDelegate) {

      $scope.error = null;

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
      });

      MesasService.consultarMesas()
        .then(
          function(data) {
              $scope.listmesas = data.object;
              if($scope.listmesas == null) {
                setTimeout(function () {
                  $scope.$apply(function(){
                    $scope.error = data.message;
                  });
                }, 1000);
              }
              setTimeout(function () {
                $ionicLoading.hide();
              },1500);
          },
          function(error) {
              $scope.error = "Carregue a página novamente";
              setTimeout(function () {
                $ionicLoading.hide();
              },1500);
          }
        );

      $scope.editMesas = function(codigo) {
        for(var i=0; i < $scope.listmesas.length; i++) {
          if(codigo === $scope.listmesas[i].codigo){
            $scope.editmesa = $scope.listmesas[i];
          }
        }
        $state.go("edit/mesas", { mesa:   $scope.editmesa });
      };

      $scope.doRefresh = function() {
        MesasService.consultarMesas()
          .then(
            function(data) {
                $scope.listmesas = data.object;
                if($scope.listmesas == null) {
                  setTimeout(function () {
                    $scope.$apply(function(){
                      $scope.error = data.message;
                    });
                  }, 1000);
                }
            },
            function(error) {
                $scope.error = "Carregue a página novamente";
            }
          );
         $scope.$broadcast('scroll.refreshComplete');
      }
      $scope.back = function() {
        $ionicNavBarDelegate.back();
      }

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
          viewData.enableBack = true;
      });

      $scope.backConsMesas = function() {
        $state.go("mesas");
      }

      $rootScope.toggleItem= function(item) {
         if ($scope.isItemShown(item)) {
           $scope.shownItem = null;
         } else {
           $scope.shownItem = item;
         }
       };

      $rootScope.isItemShown = function(item) {
         return $scope.shownItem === item;
      };

      $scope.backToMain = function() {
        $state.go("main");
      }

    };
})();
