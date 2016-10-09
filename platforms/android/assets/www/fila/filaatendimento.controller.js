(function() {
    'use strict';
    angular
        .module('filaatendimento.controller', [])
        .controller('FilaatendimentoCtrl', FilaatendimentoCtrl);

    FilaatendimentoCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'FilasService', '$ionicLoading'];
    function FilaatendimentoCtrl($rootScope, $scope, $state, $ionicPopup, FilasService, $ionicLoading) {

      $scope.colums = [{"nome":'Qtde'},{"nome":'Nome'},{"nome":'Mesa'}];
      var myPopup;
      var confirmation;

      $scope.list = [];

        FilasService.selectAtendimento()
          .then(
            function(data) {
                $scope.list = data.object;
                console.log(data.object)
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
          FilasService.selectAtendimento()
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


      $scope.checkout = function(codAtend) {

        FilasService.getAllStatusAtend()
          .then(
            function(data) {
                $scope.statusAtend = data;
                $scope.statusEscolhido = data[0];
            },
            function(error) {
                $scope.error = "Carregue a página novamente";
            }
          );

        confirmation = $ionicPopup.show({
          template: '<label class="item item-input item-select"> \
            <span class="input-label">Status</span> \
              <select ng-model="statusEscolhido"> \
                <option ng-repeat="data in statusAtend" selected>{{data}}</option> \
              </select> \
         </label> \
         <br/>\
        <button class="button button-outline button-stable button-checkin" ng-click="efetuarCheckout(statusEscolhido, '+codAtend+')">Confirmar</button>',
          title: 'Confirmação',
          subTitle: '',
          scope: $scope,
          buttons: [
            { text: 'Fechar' }
          ]
        });
      };

      $scope.efetuarCheckout = function(statusEscolhido, codAtend){
        console.log(statusEscolhido)
        if(statusEscolhido == "") {
          alert("erro");
        }
        confirmation.close();
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });

        FilasService.efetuarCheckout(statusEscolhido, codAtend)
          .then(
            function(data) {
                $scope.showAlert(data.message);
                $scope.doRefresh();
                $ionicLoading.hide();
            },
            function(error) {
                $scope.error = "Carregue a página novamente";
                $scope.showAlert($scope.error);
                $ionicLoading.hide();
            }
          );
      }

      $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
          title: '',
          template: msg
        });
      }

      $scope.backFila = function() {
        $state.go('gerenciar');
      }

    };
})();
