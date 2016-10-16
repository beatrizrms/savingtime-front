(function() {
    angular
        .module('disponibilidade.controller', [])
        .controller('DisponibilidadeCtrl', DisponibilidadeCtrl);

    DisponibilidadeCtrl.$inject = ['$rootScope', '$scope', '$state', 'ReservaService', '$ionicLoading', '$stateParams', '$ionicPopup', '$ionicHistory'];
    function DisponibilidadeCtrl($rootScope, $scope, $state, ReservaService, $ionicLoading, $stateParams, $ionicPopup, $ionicHistory) {

      var reserva = $stateParams.dados;

      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
      });

      ReservaService.verificarDisponibilidade(reserva)
        .then(
          function(data) {
            console.log(data);
            if(data.object != null) {
              $scope.retornoDisp = data.object[0];

              switch ($scope.retornoDisp.reservaAtual.codCategoria) {
                case 1:
                   $scope.retornoDisp.reservaAtual.nomeCategoria = 'Refeição Rápida';
                    break;
                case 2:
                    $scope.retornoDisp.reservaAtual.nomeCategoria = 'Almoco Executivo';
                    break;
                case 3:
                    $scope.retornoDisp.reservaAtualnomeCategoria = 'Jantar Executivo';
                    break;
                case 4:
                    $scope.retornoDisp.reservaAtual.nomeCategoria = 'Almoço Familiar';
                    break;
                case 5:
                    $scope.retornoDisp.reservaAtual.nomeCategoria = 'Jantar Familiar';
                    break;
                case 6:
                    $scope.retornoDisp.reservaAtual.nomeCategoria = 'Aniversário';
                    break;
                case 7:
                    $scope.retornoDisp.reservaAtual.nomeCategoria = 'Happy Hour';
                    break;
                default:

            }

              var dataSplited = $scope.retornoDisp.reservaAtual.dataReserva.split("-");
              $scope.dataFormatada = dataSplited[2] + "/" + dataSplited[1] + "/" + dataSplited[0];

              var reservasI = $scope.retornoDisp.reservasImpactantes;

              if(reservasI != null) {
                var newListReservas = [];
                var tam = reservasI.length;

                newListReservas.push([$scope.retornoDisp.reservaAtual.qtPessoas + " lug",
                  "Reserva",
                  convertStringToDate($scope.retornoDisp.reservaAtual.dataReserva + " " + $scope.retornoDisp.reservaAtual.horaReserva, false) ,
                  convertStringToDate($scope.retornoDisp.reservaAtual.dataReserva + " " + $scope.retornoDisp.reservaAtual.horaPrevisaoTermino, false)]);

                for(i=0; i < tam; i ++) {

                  console.log("******");
                  console.log(reservasI);

                  newListReservas.push(
                    [reservasI[i].qtPessoas + " lug", "_", convertStringToDate(reservasI[i].horaReserva, true), convertStringToDate(reservasI[i].horaPrevisaoTermino, true)]);
                }

                $scope.retornoDisp.reservasImpactantes = newListReservas;

                console.log($scope.retornoDisp.reservasImpactantes);

                google.charts.load('45',{'packages':['timeline']});
                google.charts.setOnLoadCallback(drawChart);
              } else {
                $scope.erroReservasImpactantes = "Não há reservas impactantes neste dia!"
                $ionicLoading.hide();
              }
            } else {
              $ionicLoading.hide();
              $ionicHistory.goBack();
              $scope.showAlert(data.message);
            }

          },
          function(error) {
            google.charts.load('45',{'packages':['timeline']});
            //$scope.showAlert("Tente novamente");
            $ionicLoading.hide();
          }
        );

        $scope.showAlert = function(msg) {
          var alertPopup = $ionicPopup.alert({
            title: '',
            template: msg
          });
        }

        function drawChart() {
          var container = document.getElementById('timeline');
          var chart = new google.visualization.Timeline(container);
          var dataTable = new google.visualization.DataTable();

          dataTable.addColumn({ type: 'string', id: 'Reserva' });
          dataTable.addColumn({ type: 'string', id: 'Name' });
          dataTable.addColumn({ type: 'datetime', id: 'Start' });
          dataTable.addColumn({ type: 'datetime', id: 'End' });

          dataTable.addRows($scope.retornoDisp.reservasImpactantes);

          var rowHeight = 30;
          var chartHeight = (dataTable.getNumberOfRows() + 1) * rowHeight;

          var options = {
            height: chartHeight,
            colors: ['#87CEEB', '#FF6347'],
            timeline: { rowLabelStyle: {fontName: 'San Fran', fontSize: 12, color: 'rgb(41,91,171)' },
                        barLabelStyle: { fontName: 'San Fran', fontSize: 10 }
                      }
          };

          chart.draw(dataTable, options);
          $ionicLoading.hide();
        }

        $scope.continuarReserva = function() {
          console.log($scope.retornoDisp.reservaAtual);
          $state.go('confirmar/reserva',{ reserva: $scope.retornoDisp.reservaAtual});
        }

        function convertStringToDate (data,zero) {
          //converter horaReserva
          var copyData = data;
          var splittedHora;
          if(zero) {
            splittedHora = copyData.substring(0,copyData.length-2).split(/[ .:;?!~,`"&|()<>{}\[\]\r\-/\\]+/);

          } else {
            splittedHora = copyData.split(/[ .:;?!~,`"&|()<>{}\[\]\r\-/\\]+/);

          }
          var dateTimeHoraReserva = new Date(splittedHora[0], splittedHora[1]-1, 1900 - splittedHora[2], splittedHora[3], splittedHora[4], splittedHora[5], 00 );
          return dateTimeHoraReserva;
        }
    };


})();
