(function() {
    'use strict';
    angular
        .module('filaespera.controller', [])
        .controller('FilaesperaCtrl', FilaesperaCtrl);

    FilaesperaCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'FilasService', '$ionicLoading'];
    function FilaesperaCtrl($rootScope, $scope, $state, $ionicPopup, FilasService, $ionicLoading) {

      var myPopup;
      var chooseTable;
      var confirmation;
      $scope.list = [];
      $scope.busca = {
        codmesa: ''
      }

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
      });

      FilasService.selectEspera()
        .then(
          function(data) {
              $scope.list = data.object;
              if($scope.list == null) {
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

        $scope.doRefresh = function() {
          FilasService.selectEspera()
            .then(
              function(data) {
                  $scope.list = data.object;
                  if($scope.list == null) {
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
           $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.atender = function(qtPessoas, codAtend) {

          $ionicLoading.show({
            template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
          });

          FilasService.mesasCapacidades(qtPessoas)
            .then(
              function(data) {
                  $scope.mesascap = data.object;
                  if($scope.mesascap == null) {
                    setTimeout(function () {
                      $scope.$apply(function(){
                        $scope.showAlert("Não há mesas disponíveis");
                      });
                    }, 1000);
                  } else {
                    chooseTable = $ionicPopup.show({
                      template: '<label class="item item-input item-select"> \
                        <span class="input-label">Mesa</span> \
                          <select ng-model="busca.codmesa"> \
                            <option ng-repeat="data in mesascap" value="{{data.codigo}}">{{data.numMesa}} ( {{data.capacidade}} lugares - {{data.status}} )</option> \
                          </select> \
                     </label> \
                     <button class="button button-outline button-stable button-checkin" ng-click="confirmar('+codAtend+')">Confirmar</button> <br/>',
                      title: 'Escolher mesa',
                      subTitle: 'Estas mesas estão disponíveis',
                      scope: $scope,
                      buttons: [
                        { text: 'Fechar' }
                      ]
                    });

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



        }


          $scope.confirmar = function(codAtend) {
            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
            });

            var codigoMesaAtend = $scope.busca.codmesa;

            FilasService.selectMesaAtend(codAtend, codigoMesaAtend)
              .then(
                function(data) {
                    $scope.showAlert(data.message);
                    $ionicLoading.hide();
                },
                function(error) {
                    $scope.error = "Carregue a página novamente";
                    $scope.showAlert($scope.error );
                    $ionicLoading.hide();
                }
              );

            chooseTable.close();
          }


          $scope.showAlert = function(msg) {
            var alertPopup = $ionicPopup.alert({
              title: '',
              template: msg
            });
          }

          $scope.cancelarCheckinPopup = function(codAtend) {
            FilasService.getAllStatusAtend()
              .then(
                function(data) {
                    $scope.statusAtend = data;
                    $scope.statusAtend.splice(2,1);
                    confirmation = $ionicPopup.show({
                      template: '<label class="item item-input item-select"> \
                        <span class="input-label">Status</span> \
                          <select ng-model="statusEscolhido"> \
                            <option ng-repeat="data in statusAtend" selected>{{data}}</option> \
                          </select> \
                     </label> \
                    <button class="button button-outline button-stable button-checkin" ng-click="cancelarCheckin(statusEscolhido, '+codAtend+')">Confirmar</button>',
                      title: 'Confirmação',
                      subTitle: '',
                      scope: $scope,
                      buttons: [
                        { text: 'Fechar' }
                      ]
                    });
                },
                function(error) {
                    $scope.error = "Carregue a página novamente";
                }
              );


          }

          $scope.cancelarCheckin = function(statusEscolhido, codAtend) {
            confirmation.close();
            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
            });

            FilasService.cancelarCheckin(statusEscolhido, codAtend)
              .then(
                function(data) {
                    $scope.showAlert(data.message);
                    $ionicLoading.hide();
                },
                function(error) {
                    $scope.error = "Carregue a página novamente";
                    $scope.showAlert($scope.error);
                    $ionicLoading.hide();
                }
              );
          }

          $scope.backFila = function() {
            $state.go('gerenciar');
          }

    };
})();
