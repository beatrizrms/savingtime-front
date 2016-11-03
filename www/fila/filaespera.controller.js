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

      loadFila();

        $scope.doRefresh = function() {
          loadFila();
        }

        $scope.atender = function(qtPessoas, codAtend, codCategoria) {

          $ionicLoading.show({
            template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
          });

          FilasService.mesasCapacidades(qtPessoas)
            .then(
              function(data) {
                console.log(data.object);
                  $scope.mesascap = data.object;
                  if($scope.mesascap == null) {
                    setTimeout(function () {
                      $scope.$apply(function(){
                        $scope.showAlert("Não há mesas disponíveis");
                      });
                    }, 1000);
                  } else {
                    $scope.busca.codmesa = $scope.mesascap[0].numMesa;
                    for(var i=0; i < $scope.mesascap.length; i++){
                      $scope.mesascap[i].description = "( "+$scope.mesascap[i].capacidade +" lugares - " + $scope.mesascap[i].status +" )"
                      console.log()
                    };
                    setTimeout(function () {
                      chooseTable = $ionicPopup.show({
                        template: '<label class="item item-input item-select"> \
                          <span class="input-label">Mesa</span> \
                            <select ng-model="busca.codmesa" ng-options="option.codigo as option.description for option in mesascap"> \
                            </select> \
                       </label> \
                       <br/> \
                       <button class="button button-outline button-stable button-checkin" ng-click="confirmar('+codAtend+','+codCategoria+')">Confirmar</button> <br/>',
                        title: 'Escolher mesa',
                        subTitle: 'Estas mesas estão disponíveis',
                        scope: $scope,
                        buttons: [
                          { text: 'Fechar' }
                        ]
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



        }


          $scope.confirmar = function(codAtend, codCategoria) {
            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
            });

            var codigoMesaAtend = $scope.busca.codmesa;

            FilasService.selectMesaAtend(codAtend, codigoMesaAtend, codCategoria)
              .then(
                function(data) {
                    console.log(codigoMesaAtend);
                    $scope.showAlert(data.message);
                    $scope.doRefresh();
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
                    $scope.statusEscolhido = data[0];
                    $scope.statusAtend.splice(2,1);
                    confirmation = $ionicPopup.show({
                      template: '<label class="item item-input item-select"> \
                        <span class="input-label">Status</span> \
                          <select ng-model="statusEscolhido"> \
                            <option ng-repeat="data in statusAtend" >{{data}}</option> \
                          </select> \
                     </label> \
                      <br/>\
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

          $scope.$on("$ionicView.enter", function() {
            loadFila();
          });

          function loadFila() {
            $ionicLoading.show();
            FilasService.selectEspera()
              .then(
                function(data) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.list = data.object;
                    if($scope.list == null) {
                      setTimeout(function () {
                        $scope.$apply(function(){
                          $scope.error = data.message;
                        });
                      }, 1000);
                    }
                    $ionicLoading.hide();
                },
                function(error) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.error = "Carregue a página novamente";
                    $ionicLoading.hide();
                }
              );
          }

    };
})();
