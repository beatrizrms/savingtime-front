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

      $scope.retornoDisp = {
                          tamFila: '',
                          tempoEspera: '',
                          tempoEspera: '',
                          reservasImpactantes: [[ '8 lug', '#', new Date(2016, 3, 30, 10,0,0), new Date(2016, 3, 30, 12,45,0) ],
                                                [ '7 lug', '#', new Date(2016, 3, 30, 11,0,0), new Date(2016, 3, 30, 12,0,0) ],
                                                [ '6 lug', '#', new Date(2016, 3, 30, 12,0,0), new Date(2016, 3, 30, 14,45,0,0) ],
                                                [ '4 lug', '?', new Date(2016, 3, 30, 15,0,0), new Date(2016, 3, 30, 19,0,0)],
                                                [ '2 lug', '#', new Date(2016, 3, 30, 13,0,0), new Date(2016, 3, 30, 19,45,0,0) ],
                                                [ '1 lug', '#', new Date(2016, 3, 30, 12,0,0), new Date(2016, 3, 30, 13,45,0,0) ],
                                                [ '10 lug', '#', new Date(2016, 3, 30, 20,0,0), new Date(2016, 3, 30, 22,15,0,0) ]],
                          qtdMesasLivres: 3,
                          txUtilizacao: 0.1,
                          reservaAtual: { comprovante: "",
                                          cpf:"11111111111",
                                          dataReserva:"16-09-2016",
                                          email:"bibi_bagg@hotmail.com",
                                          horaReserva:"18:00:00 ",
                                          pagamento:"Transferencia - Pago",
                                          qtPessoas:"6",
                                          responsavel:"Beatriz Ramos",
                                          telefone:"111111111111",
                                          tipoEvento:"Almoço Familiar"}
                        }


      ReservaService.verificarDisponibilidade(reserva)
        .then(
          function(data) {
            google.charts.load('45',{'packages':['timeline']});
            google.charts.setOnLoadCallback(drawChart);
            console.log(data);
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
            colors: ['rgb(41,91,171)','rgb(124,204,228)','rgb(192,185,224)'],
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
