(function() {
    'use strict';
    angular
        .module('checkin.controller', [])
        .controller('CheckinCtrl', CheckinCtrl);

    CheckinCtrl.$inject = ['$rootScope', '$scope', '$state', 'CheckinService', '$ionicLoading', '$ionicPopup', '$ionicNavBarDelegate', 'ReservaService', '$ionicHistory', "$filter"];
    function CheckinCtrl($rootScope, $scope, $state, CheckinService, $ionicLoading, $ionicPopup, $ionicNavBarDelegate, ReservaService, $ionicHistory, $filter) {

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
                console.log(data.object);
                if(data.object != null){
                  if (data.object.length > 0) {
                    $scope.categoria = true;
                    $scope.listcategorias = data.object;
                    $scope.checkin.codCategoria = data.object[0].codCategoria;
                  }
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
                  if($scope.reserva.length > 1){
                    $scope.showConfirmationCheckinReservaMoreThan1();
                  } else {
                    $scope.showConfirmationCheckinReserva();
                  }
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

      $scope.showConfirmationCheckinReservaMoreThan1 = function() {
        var content = "Há duas reservas disponíveis, pesquise pelo código da reserva <br/>";
        for(var i=0; i<$scope.reserva.length; i++) {
          content+='<br/><p> Cod Reserva: '+$scope.reserva[i].codReserva+'</p> \
           <p> Data Reserva: '+$scope.reserva[i].dataReserva+'</p> \
           <p>Hora Reserva: '+$scope.reserva[i].horaReserva+'</p> \
           <p>Responsável: '+$scope.reserva[i].responsavel+'</p> \
           <p> Pessoas: '+$scope.reserva[i].qtPessoas+'</p> \
           <p> Tipo de Evento: '+$scope.reserva[i].nomeCategoria+'</p> \
           <p ng-show="'+$scope.reserva[i].escolhida+'"> Escolhida!</p>\
           <br/>'
        }
        var confirmPopup = $ionicPopup.confirm({
         title: 'Escolha uma das reservas',
         template:content
       });

       confirmPopup.then(function(res) {
         if(res) {

         }
       });
      }

      $scope.escolherReserva = function(i) {
        for(var j=0; j<$scope.reserva.length; j++) {
          $scope.reserva[j].escolhida = false;
        }
        $scope.reserva[i].escolhida = true;
        $scope.reservaEscolhida = i;
      }

      $scope.showConfirmationCheckinReserva = function(i) {
        var num;
        if (i != undefined && i != null) {
          num = i;
        } else {
          num = 0;
        }

        var confirmPopup = $ionicPopup.confirm({
         title: 'Confirmar Check-in?',
         template: '\
                   <p> Cod Reserva: '+$scope.reserva[num].codReserva+'</p> \
                   <p> Data Reserva: '+$scope.reserva[num].dataReserva+'</p> \
                   <p>Responsável: '+$scope.reserva[num].responsavel+'</p> \
                   <p>Hora Reserva: '+$scope.reserva[num].horaReserva+'</p> \
                   <p>Hora previsão término: '+$scope.reserva[num].horaPrevisaoTermino+'</p> \
                   <p> Cpf: '+$scope.reserva[num].cpf+'</p> \
                   <p> Email: '+$scope.reserva[num].email+'</p> \
                   <p> Status da Reserva: '+$scope.reserva[num].statusReserva+'</p> \
                   <p> Telefone: '+ $filter('tel')($scope.reserva[num].telefone) +'</p> \
                   <p> Pessoas: '+$scope.reserva[num].qtPessoas+'</p> \
                   <p> Tipo de Evento: '+$scope.reserva[num].nomeCategoria+'</p> '
       });

       confirmPopup.then(function(res) {
         if(res) {
           $scope.fazerCheckin($scope.reserva[num]);
         }
       });
      };

      $scope.fazerCheckin = function(checkin) {
        console.log(checkin)
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
          codCategoria: checkin.codCategoria,
          telefone: checkin.telefone,
          qtPessoas: checkin.qtPessoas
        }
      } else {
        atendimento = {
          nomeResponsavel: checkin.responsavel,
          codCategoria: checkin.codCategoria,
          telefone: checkin.telefone,
          qtPessoas: checkin.qtPessoas
        }
      }

        CheckinService.efetuarCheckin(atendimento)
          .then(
            function(data) {
                console.log(data)
                $ionicLoading.hide();
                $scope.showAlert(data.message + "<br/>SENHA: <b>"+ data.value + '</b>');
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
