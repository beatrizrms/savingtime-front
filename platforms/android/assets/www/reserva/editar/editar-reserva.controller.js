(function() {
    angular
        .module('editarreserva.controller', [])
        .controller('EditReservaCtrl', EditReservaCtrl);

    EditReservaCtrl.$inject = ['$rootScope', '$scope', '$state', 'ReservaService', '$filter', '$ionicPopup', '$ionicLoading', '$ionicActionSheet', '$ionicNavBarDelegate'];
    function EditReservaCtrl($rootScope, $scope, $state, ReservaService, $filter, $ionicPopup, $ionicLoading, $ionicActionSheet, $ionicNavBarDelegate) {

      $scope.editarReserva = function() {


        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>'
        });
        $scope.reservaedit.horaReserva = $filter('date')($scope.reservaedit.horaReserva, 'HH:mm:00 ', '-0300');
        console.log($scope.reservaedit);
        $scope.reservaedit.comprovante = '';


          ReservaService.editarReserva($scope.reservaedit)
            .then(
              function(data) {
                  $scope.showAlert(data.message);
                  $ionicLoading.hide();
                  $state.go('gerenciar/reserva');

              },
              function(error) {
                  $scope.showAlert("Tente novamente");
                  $ionicLoading.hide();
              }
            );
        }

        $scope.cancelarReserva = function(codigo) {
          ReservaService.cancelarReserva(codigo)
            .then(
              function(data) {
                  $scope.showAlert(data.message);
                  $ionicLoading.hide();
                  $state.go('gerenciar/reserva');

              },
              function(error) {
                  $scope.showAlert("Tente novamente");
                  $ionicLoading.hide();
              }
            );
          };

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
                      $scope.reservaedit.comprovante = "data:image/jpeg;base64, "+image;
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
                      $scope.reservaedit.comprovante = "data:image/jpeg;base64, "+image;
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

          $scope.back = function() {
            $ionicNavBarDelegate.back();
          }

        $scope.showAlert = function(msg) {
          var alertPopup = $ionicPopup.alert({
            title: '',
            template: msg
          });
        }

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
    };
})();
