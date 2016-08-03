(function() {
    'use strict';
    angular
        .module('consmesascap.controller', [])
        .controller('ConsMesasCapCtrl', ConsMesasCapCtrl);

    ConsMesasCapCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'MesasService', '$timeout', '$ionicLoading', '$ionicNavBarDelegate'];
    function ConsMesasCapCtrl($rootScope, $scope, $state, $ionicPopup, MesasService, $timeout, $ionicLoading, $ionicNavBarDelegate) {

      $scope.error = null;
      $scope.quantidade = { 'num' : '2' };

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
      });

      MesasService.consultarMesasCapacidade($scope.quantidade.num)
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
              },1000);
          },
          function(error) {
              $scope.error = "Carregue a página novamente";
              setTimeout(function () {
                $ionicLoading.hide();
              },1000);
          }
        );


      $scope.pesquisar = function() {
          $scope.error = '';
          $ionicLoading.show({
            template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
          });

          MesasService.consultarMesasCapacidade($scope.quantidade.num)
            .then(
              function(data) {
                  $scope.listmesas = data.object;
                  if($scope.listmesas == null) {
                        $scope.error = data.message;
                  }
                  $ionicLoading.hide();
              },
              function(error) {
                  $scope.error = "Carregue a página novamente";
                  $ionicLoading.hide();
              }
            );
      }

        $scope.editMesas = function(codigo) {
          for(var i=0; i < $scope.listmesas.length; i++) {
            if(codigo === $scope.listmesas[i].codigo){
              $rootScope.editmesa = $scope.listmesas[i];
            }
          }
          $state.go("edit/mesas");
        };

      $scope.doRefresh = function() {
        $scope.error = null;
        MesasService.consultarMesasCapacidade()
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
