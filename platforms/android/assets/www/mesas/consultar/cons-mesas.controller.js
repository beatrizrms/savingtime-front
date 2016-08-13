(function() {
    'use strict';
    angular
        .module('consmesas.controller', [])
        .controller('ConsMesasCtrl', ConsMesasCtrl);

    ConsMesasCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'MesasService', '$ionicLoading'];
    function ConsMesasCtrl($rootScope, $scope, $state, $ionicPopup, MesasService, $ionicLoading) {

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
            $rootScope.editmesa = $scope.listmesas[i];
          }
        }
        $state.go("edit/mesas");
      };

      $scope.doRefresh = function() {
        $scope.error = null;
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

    };
})();
