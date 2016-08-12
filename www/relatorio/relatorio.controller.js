(function() {
    'use strict';
    angular
        .module('relatorio.controller', [])
        .controller('RelatorioCtrl', RelatorioCtrl);

    RelatorioCtrl.$inject = ['$rootScope', '$scope', '$state', 'ionicDatePicker', '$filter', 'RelatorioService', '$ionicLoading', '$ionicPopup', '$cordovaFileTransfer', '$timeout'];
    function RelatorioCtrl($rootScope, $scope, $state, ionicDatePicker, $filter, RelatorioService, $ionicLoading, $ionicPopup, $cordovaFileTransfer, $timeout) {

        $scope.showExcel = false;

        $scope.gerarRelatorio = function(dataInicio, dataFinal) {
          $ionicLoading.show({
            template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
          });
          dataInicio = $filter('date')(dataInicio, 'dd-MM-yyyy', '-0300')
          dataFinal = $filter('date')(dataFinal, 'dd-MM-yyyy', '-0300');

          RelatorioService.gerarRelatorio(dataInicio, dataFinal)
            .then(
              function(data) {
                console.log(data);
                  $scope.showExcel = true;
                  $scope.downloadExcel(data.message);
                  $ionicLoading.hide();
              },
              function(error) {
                  $scope.showAlert("Tente novamente");
                  $ionicLoading.hide();
              }
            );
        }

        $scope.downloadExcel = function(message) {
          console.log("entrou");
          var url =  encodeURI('http://usjt-savingtime.rhcloud.com/relatoriorest/download/xls');
          var target;

          if (ionic.Platform.isIOS()) {
            target = cordova.file.syncedDataDirectory;
          } else if (ionic.Platform.isAndroid()) {
            target = cordova.file.externalRootDirectory;
          }
          var targetPath =  target+ "/relatorio.xls";
          console.log(targetPath);
          var trustHosts = true;
          var options = {};

          $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
            .then(function(result) {
              console.log('sucess');
              $scope.showAlert(message + "\n O arquivo está em "+result.nativeURL);

            }, function(err) {
              console.log("erro");
              console.log(err);
            }, function (progress) {
              console.log(progress);
              $timeout(function () {
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              });
            });

        }

        $scope.showAlert = function(msg) {
          var alertPopup = $ionicPopup.alert({
            title: '',
            template: msg
          });
        }

        $scope.backRelatorio = function() {
          $state.go("main");
        }

    };


})();
