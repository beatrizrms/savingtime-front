(function() {
    angular
        .module('cadreserva.controller', [])
        .controller('CadReservaCtrl', CadReservaCtrl);

    CadReservaCtrl.$inject = ['$rootScope', '$scope', '$state', 'ionicDatePicker', 'ReservaService', '$filter', '$ionicActionSheet', '$ionicPopup', '$ionicLoading'];
    function CadReservaCtrl($rootScope, $scope, $state, ionicDatePicker, ReservaService, $filter, $ionicActionSheet, $ionicPopup, $ionicLoading) {


    $scope.reserva = {};
    $scope.reserva = {
                      dataReserva: new Date(),
                      horaReserva: new Date(2000, 0, 1, 18, 0, 0),
                      comprovante: ''
                     };
    $scope.anexado = '';
    $scope.categoria = false;


      $scope.showCategoria = function(quantidade) {
        $ionicLoading.show();
        $scope.categoria = false;
        if(quantidade !== '' && quantidade !== undefined && quantidade !== null) {
        ReservaService.categorias(quantidade)
          .then(
            function(data) {
                console.log(data);
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

      $scope.cadastrarReserva = function() {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>'
        });

          $scope.reserva.dataReserva = $filter('date')($scope.reserva.dataReserva, 'dd-MM-yyyy');
          $scope.reserva.horaReserva = $filter('date')($scope.reserva.horaReserva, 'HH:mm:00 ', '-0200');

          console.log($scope.reserva);

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

      $scope.addPicture = function() {
            showActionSheet();
        };

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
                    $scope.anexado = 'Anexado!!'
                  });

                }, function(err) {
                  showActionSheet();
                },{ quality: 70,
                    encodingType: Camera.EncodingType.JPEG,
                    correctOrientation: true,
                    destinationType: Camera.DestinationType.DATA_URL
                });


              } else {
                navigator.camera.getPicture(function(imageURI) {
                  $scope.$apply(function (){
                    image = imageURI;
                    $scope.reserva.comprovante = "data:image/jpeg;base64, "+image;
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
          });//
        }



        $scope.showAlert = function(msg) {
          var alertPopup = $ionicPopup.alert({
            title: '',
            template: msg
          });
        }

        $scope.backCadReserva = function() {
          $state.go('gerenciar/reserva');
        }

    };
})();
