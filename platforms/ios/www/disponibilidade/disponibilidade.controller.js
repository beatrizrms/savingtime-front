(function() {
    angular
        .module('disponibilidade.controller', [])
        .controller('DisponibilidadeCtrl', DisponibilidadeCtrl);

    DisponibilidadeCtrl.$inject = ['$rootScope', '$scope', '$state', 'ReservaService', '$ionicLoading', '$stateParams', '$ionicPopup'];
    function DisponibilidadeCtrl($rootScope, $scope, $state, ReservaService, $ionicLoading, $stateParams, $ionicPopup) {

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
              // mock
              $scope.retornoDisp.txUtilizacao = 0.1;

              var reservasI = $scope.retornoDisp.reservasImpactantes;

              if(reservasI != null) {
                var newListReservas = [];
                var tam = reservasI.length;

                newListReservas.push([$scope.retornoDisp.reservaAtual.qtPessoas + " lug", 
                  "Reserva", 
                  new Date($scope.retornoDisp.reservaAtual.dataReserva + " " + $scope.retornoDisp.reservaAtual.horaReserva) , 
                  new Date($scope.retornoDisp.reservaAtual.dataReserva + " " + $scope.retornoDisp.reservaAtual.horaPrevisaoTermino)]);

                for(i=0; i < tam; i ++) {
                  reservasI[i].horaReserva = new Date(reservasI[i].horaReserva);
                  reservasI[i].horaPrevisaoTermino = new Date(reservasI[i].horaPrevisaoTermino);
                  newListReservas.push(
                    [reservasI[i].qtPessoas + " lug", "_", reservasI[i].horaReserva, reservasI[i].horaPrevisaoTermino]);
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
              $scope.showAlert(data.message);
            }

          },
          function(error) {
            google.charts.load('45',{'packages':['timeline']});
            google.charts.setOnLoadCallback(drawChart);
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

          var rowHeight = 37;
          var chartHeight = (dataTable.getNumberOfRows() + 1) * rowHeight;

          var options = {
            height: chartHeight,
            colors: ['#FF6347', '#87CEEB'],
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


    };


})();
