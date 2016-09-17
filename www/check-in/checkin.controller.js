(function() {
    'use strict';
    angular
        .module('checkin.controller', [])
        .controller('CheckinCtrl', CheckinCtrl);

    CheckinCtrl.$inject = ['$rootScope', '$scope', '$state', 'CheckinService', '$ionicLoading', '$ionicPopup', '$ionicNavBarDelegate', 'ReservaService', '$ionicHistory'];
    function CheckinCtrl($rootScope, $scope, $state, CheckinService, $ionicLoading, $ionicPopup, $ionicNavBarDelegate, ReservaService, $ionicHistory) {

      $scope.reserva = [];
      $scope.busca = '';
      $scope.checkin = {};
      $scope.categoria = false;

      $scope.showCategoria = function(quantidade) {
        $ionicLoading.show();
        $scope.categoria = false;
        if(quantidade !== '' && quantidade !== undefined && quantidade !== null){
        ReservaService.categorias(quantidade)
          .then(
            function(data) {
                console.log(data);
                if (data.length > 0) {
                  $scope.categoria = true;
                  $scope.listcategorias = data;
                  $scope.checkin.tipoEvento = data[0];
                }

                $ionicLoading.hide();

            },
            function(error) {
                $scope.showAlert("Tente novamente");
                $ionicLoading.hide();
            }
          );
        } else {
          $ionicLoading.hide();
        }
      }

      $scope.buscarReserva = function(busca) {

        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });

        CheckinService.consultarReserva(busca)
          .then(
            function(data) {
                $scope.reserva = data.object;
                if($scope.reserva == null) {
                    $scope.error = data.message;
                    $scope.showAlert($scope.error);
                } else {
                  $scope.showConfirmationCheckinReserva();
                }
                setTimeout(function () {
                  $ionicLoading.hide();
                },1500);
            },
            function(error) {
                $scope.error = "Carregue a página novamente";
                $scope.showAlert($scope.error);
            }
          );
      }


      $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
          title: '',
          template: msg
        });
      }

      $scope.showConfirmationCheckinReserva = function() {
        var confirmPopup = $ionicPopup.confirm({
         title: 'Confirmar Check-in?',
         template: '\
                   <p> Cod Reserva: '+$scope.reserva[0].codReserva+'</p> \
                   <p> Data Reserva: '+$scope.reserva[0].dataReserva+'</p> \
                   <p>Responsável: '+$scope.reserva[0].responsavel+'</p> \
                   <p>Hora Reserva: '+$scope.reserva[0].horaReserva+'</p> \
                   <p> Cpf: '+$scope.reserva[0].cpf+'</p> \
                   <p> Email: '+$scope.reserva[0].email+'</p> \
                   <p> Status da Reserva: '+$scope.reserva[0].statusReserva+'</p> \
                   <p> Telefone: '+$scope.reserva[0].telefone+'</p> \
                   <p> Pessoas: '+$scope.reserva[0].qtPessoas+'</p> \
                   <p> Tipo de Evento: '+$scope.reserva[0].tipoEvento+'</p> '
       });

       confirmPopup.then(function(res) {
         if(res) {
           $scope.fazerCheckin($scope.reserva[0]);
         }
       });
      }

      $scope.fazerCheckin = function(checkin) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Cadastrar Checkin',
          template: 'Você tem certeza ?'
        });

        confirmPopup.then(function(res) {
          if(res) {
            fazerCheckin(checkin);
          }
        });
      }

      function fazerCheckin(checkin) {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });

        var atendimento = {};

        if(checkin.codReserva) {
        atendimento = {
          numReserva: checkin.codReserva,
          nomeResponsavel: checkin.responsavel,
          tipoEvento: checkin.tipoEvento,
          telefone: checkin.telefone,
          qtPessoas: checkin.qtPessoas
        }
      } else {
        atendimento = {
          nomeResponsavel: checkin.responsavel,
          tipoEvento: checkin.tipoEvento,
          telefone: checkin.telefone,
          qtPessoas: checkin.qtPessoas
        }
      }

        CheckinService.efetuarCheckin(atendimento)
          .then(
            function(data) {
                $ionicLoading.hide();
                $scope.showAlert(data.message);
                $ionicHistory.goBack();

            },
            function(error) {
                $ionicLoading.hide();
                $scope.error = "Carregue a página novamente";
                $scope.showAlert($scope.error);

            }
          );
      }


      $scope.backCheckin = function() {
        $state.go('gerenciar');
      }




    };


})();
