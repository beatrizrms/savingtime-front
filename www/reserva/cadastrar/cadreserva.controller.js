(function() {
    angular
        .module('cadreserva.controller', [])
        .controller('CadReservaCtrl', CadReservaCtrl);

    CadReservaCtrl.$inject = ['$rootScope', '$scope', '$state', 'ionicDatePicker', 'ReservaService', '$filter', '$ionicActionSheet', '$ionicPopup', '$ionicLoading', '$ionicModal', '$stateParams'];
    function CadReservaCtrl($rootScope, $scope, $state, ionicDatePicker, ReservaService, $filter, $ionicActionSheet, $ionicPopup, $ionicLoading, $ionicModal, $stateParams) {

    console.log($stateParams);
    /** IF   - Entrando na tela de reserva
      * ELSE - Entrando na tela de confirmação de reserva **/
    if($stateParams.reserva == null){
      $scope.reserva = {
                        dataReserva: new Date(),
                        horaReserva: new Date(2000, 0, 1, 18, 0, 0)
                       };
      $scope.categoria = false;
    } else {
      $scope.anexado = '';
      $scope.anexo = false;
      $scope.reserva = $stateParams.reserva;
    }


    $ionicModal.fromTemplateUrl('reserva/cadastrar/comprovante.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });


    $scope.showCategoria = function(quantidade) {
      $ionicLoading.show();
      $scope.categoria = false;
      if(quantidade !== '' && quantidade !== undefined && quantidade !== null) {
      ReservaService.categorias(quantidade)
        .then(
          function(data) {
              if (data.length > 0) {
                $scope.categoria = true;
                $scope.listcategorias = data;
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

      $scope.reserva.dataReserva = $filter('date')($scope.reserva.dataReserva, 'dd-MM-yyyy');
      $scope.reserva.horaReserva = $filter('date')($scope.reserva.horaReserva, 'HH:mm:00 ', '-0200');

      console.log($scope.reserva);
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
                console.log(data);
                if(data.status === 'NOT_ACCEPTABLE'){
                  $scope.showAlert(data.message);
                } else {
                  $scope.showAlert(data.message);
                  $state.go('gerenciar/reserva');
                }

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
