(function() {
    'use strict';
    angular
        .module('filaatendimento.controller', [])
        .controller('FilaatendimentoCtrl', FilaatendimentoCtrl);

    FilaatendimentoCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicPopup', 'FilasService', '$ionicLoading', '$ionicHistory'];
    function FilaatendimentoCtrl($rootScope, $scope, $state, $ionicPopup, FilasService, $ionicLoading, $ionicHistory) {

      $scope.colums = [{"nome":'Qtde'},{"nome":'Nome'},{"nome":'Mesa'}];
      var myPopup;
      var confirmation;

      $scope.list = [];


        $scope.doRefresh = function() {
          loadFila();
        }


      $scope.checkout = function(codAtend) {

        FilasService.getAllStatusAtend()
          .then(
            function(data) {
                $scope.statusAtend = data;
                $scope.statusEscolhido = data[2];
            },
            function(error) {
                $scope.error = "Carregue a página novamente";
            }
          );

        confirmation = $ionicPopup.show({
          template: '<label class="item item-input item-select"> \
            <span class="input-label">Status</span> \
              <select ng-model="statusEscolhido"> \
                <option ng-repeat="data in statusAtend">{{data}}</option> \
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

      $scope.$on("$ionicView.enter", function() {
        loadFila();
      });

      function loadFila() {
        $ionicLoading.show();
        FilasService.selectAtendimento()
          .then(
            function(data) {
              $scope.$broadcast('scroll.refreshComplete');
                $scope.list = data.object;
                console.log(data.object)
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
