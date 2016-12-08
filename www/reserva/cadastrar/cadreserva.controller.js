(function() {
    angular
        .module('cadreserva.controller', [])
        .controller('CadReservaCtrl', CadReservaCtrl);

    CadReservaCtrl.$inject = ['$rootScope', '$scope', '$state', 'ionicDatePicker', 'ReservaService', '$filter', '$ionicActionSheet', '$ionicPopup', '$ionicLoading', '$ionicModal', '$stateParams', '$ionicHistory'];
    function CadReservaCtrl($rootScope, $scope, $state, ionicDatePicker, ReservaService, $filter, $ionicActionSheet, $ionicPopup, $ionicLoading, $ionicModal, $stateParams, $ionicHistory) {

    console.log($stateParams);
    /** IF   - Entrando na tela de reserva
      * ELSE - Entrando na tela de confirmação de reserva **/
    if($stateParams.reserva == null){
      $scope.reserva = {
                        dataReserva: new Date(),
                        horaReserva: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(),new Date().getMinutes(),00),
                        pagamento: "Transferencia - Pago"
                       };

      $scope.categoria = false;
    } else {
      $scope.anexado = '';
      $scope.anexo = false;
      $scope.reserva = $stateParams.reserva;
      var dataSplited = $scope.reserva.dataReserva.split("-");
      $scope.dataFormatada = dataSplited[2] + "/" + dataSplited[1] + "/" + dataSplited[0];

      switch ($scope.reserva.codCategoria) {
            case 1:
               $scope.reserva.nomeCategoria = 'Refeição Rápida';
                break;
            case 2:
                $scope.reserva.nomeCategoria = 'Almoco Executivo';
                break;
            case 3:
                $scope.reserva.nomeCategoria = 'Jantar Executivo';
                break;
            case 4:
                $scope.reserva.nomeCategoria = 'Almoço Familiar';
                break;
            case 5:
                $scope.reserva.nomeCategoria = 'Jantar Familiar';
                break;
            case 6:
                $scope.reserva.nomeCategoria = 'Aniversário';
                break;
            case 7:
                $scope.reserva.nomeCategoria = 'Happy Hour';
                break;
            default:

        }
    }


    $ionicModal.fromTemplateUrl('reserva/cadastrar/comprovante.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.teste = function(event) {
      console.log(event.charCode >= 48 && event.charCode <= 57)
      console.log(event.charCode)
    }


    $scope.showCategoria = function(quantidade) {
      $ionicLoading.show();
      $scope.categoria = false;
      if(quantidade !== '' && quantidade !== undefined && quantidade !== null) {
      ReservaService.categorias(quantidade)
        .then(
          function(data) {
              if (data.object.length > 0) {
                $scope.categoria = true;
                $scope.listcategorias = data.object;
                $scope.reserva.codCategoria = data.object[0].codCategoria;
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


    $scope.verificarDisponibilidade = function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
      });

      console.log($scope.reserva)

      $scope.reserva.dataReserva = $filter('date')($scope.reserva.dataReserva, 'dd-MM-yyyy');
      $scope.reserva.horaReserva = $filter('date')($scope.reserva.horaReserva, 'HH:mm:00 ', '-0200');

      $ionicLoading.hide();
      $state.go('disponibilidade', {dados: $scope.reserva});
    }


    $scope.addPicture = function() {
          showActionSheet();
    };

    $scope.cadastrarReserva = function() {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Cadastrar Reserva',
          template: 'Você tem certeza ?'
        });

        confirmPopup.then(function(res) {
          if(res) {
            cadastrarReserva();
          }
        });
      }

      function cadastrarReserva() {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });

        $scope.reserva.dataReserva = $filter('date')($scope.reserva.dataReserva, 'dd-MM-yyyy');
        $scope.reserva.horaReserva = $filter('date')($scope.reserva.horaReserva, 'HH:mm:00 ', '-0200');

        ReservaService.cadastrarReserva($scope.reserva)
          .then(
            function(data) {
                console.log("Pegar reserva");
                console.log(data);
                if(data.status === 'NOT_ACCEPTABLE'){
                  $scope.showAlert(data.message);
                } else {
                  $scope.showAlert(data.message);
                  $ionicHistory.goBack(-3);
                }
                $scope.reserva = {};
                $ionicLoading.hide();

            },
            function(error) {
                $scope.showAlert("Tente novamente");
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

      $scope.getComprovanteAnexado = function() {
        $scope.openModal();
      }

      $scope.openModal = function() {
        $scope.modal.show();
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      // functions

      function showActionSheet() {
        var actionSheet = $ionicActionSheet.show({
          titleText: 'Adicionar Comprovante',
          cancelText: 'Cancel',
          buttons: [
            { text: 'Tirar foto' },
            { text: 'Escolher da galeria' }
          ],
          buttonClicked: function(index) {

            var image;
            if(index == 0) {
              navigator.camera.getPicture(function(imageURI) {
                $scope.$apply(function (){
                  image = imageURI;
                  $scope.reserva.comprovante = "data:image/jpeg;base64, "+image;
                  $scope.anexo = true;
                  $scope.anexado = 'Anexado!!'
                });

              }, function(err) {
                showActionSheet();
              },{ quality: 40,
                  encodingType: Camera.EncodingType.JPEG,
                  correctOrientation: true,
                  destinationType: Camera.DestinationType.DATA_URL
              });


            } else {
              navigator.camera.getPicture(function(imageURI) {
                $scope.$apply(function (){
                  image = imageURI;
                  $scope.reserva.comprovante = "data:image/jpeg;base64, "+image;
                  $scope.anexo = true;
                  $scope.anexado = 'Anexado!!'
                });

              }, function(err) {
                  showActionSheet();
              },{ quality: 70,
                  destinationType: Camera.DestinationType.DATA_URL,
                  sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                  correctOrientation: true,
                  encodingType: Camera.EncodingType.JPEG,
                  popoverOptions: CameraPopoverOptions
              });
            }

              return true;
          }
        });
      }

    };
})();
