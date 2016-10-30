(function() {
    angular
        .module('editarreserva.controller', [])
        .controller('EditReservaCtrl', EditReservaCtrl);

    EditReservaCtrl.$inject = ['$scope', '$state', 'ReservaService', '$filter', '$ionicPopup', '$ionicLoading', '$ionicActionSheet', '$ionicNavBarDelegate', '$ionicModal', '$stateParams', '$ionicHistory'];
    function EditReservaCtrl($scope, $state, ReservaService, $filter, $ionicPopup, $ionicLoading, $ionicActionSheet, $ionicNavBarDelegate, $ionicModal, $stateParams, $ionicHistory) {


      $ionicModal.fromTemplateUrl('reserva/cadastrar/comprovante.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $scope.reservaedit = $stateParams.reserva;
      $scope.reserva = {}
      console.log($scope.reservaedit);

      ReservaService.categorias($scope.reservaedit.qtPessoas)
        .then(
          function(data) {
              if (data.object.length > 0) {
                $scope.listcategorias = data.object;
                $scope.reservaedit.codCategoria= $scope.listcategorias[0].codCategoria;
              }

              $ionicLoading.hide();

          },
          function(error) {
              $scope.showAlert("Tente novamente");
              $ionicLoading.hide();
          }
        );



      $scope.editarReserva = function() {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Editar Reserva',
          template: 'Você tem certeza ?'
        });

        confirmPopup.then(function(res) {
          if(res) {
            editarReserva();
          }
        });
      }

      function editarReserva() {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
        });
        $scope.reservaedit.horaReserva = $filter('date')($scope.reservaedit.horaReserva, 'HH:mm:00 ', '-0200');
        $scope.reservaedit.comprovante = $scope.reserva.comprovante;

          ReservaService.editarReserva($scope.reservaedit)
            .then(
              function(data) {
                  $scope.showAlert(data.message);
                  $ionicLoading.hide();
                  $ionicHistory.goBack();

              },
              function(error) {
                  $scope.showAlert("Tente novamente");
                  $ionicLoading.hide();
              }
            );
      }

        $scope.cancelarReserva = function(codigo) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Cancelar Reserva',
            template: 'Você tem certeza ?'
          });

          confirmPopup.then(function(res) {
            if(res) {
              cancelarReserva(codigo);
            }
          });
        };

        function cancelarReserva(codigo) {
          ReservaService.cancelarReserva(codigo)
            .then(
              function(data) {
                  $scope.showAlert(data.message);
                  $ionicLoading.hide();
                  $ionicHistory.goBack();

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
                      $scope.reservaedit.comprovante = "data:image/jpeg;base64, "+image;
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

          $scope.getComprovanteAnexado = function() {
            $ionicLoading.show({
              template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>'
            });
            if($scope.reservaedit.comprovante) {
              $scope.reserva.comprovante = $scope.reservaedit.comprovante;
              $scope.openModal();
              $ionicLoading.hide();

            } else if($scope.reserva.comprovante){
              $scope.openModal();
              $ionicLoading.hide();
            } else {

            ReservaService.obterComprovante($scope.reservaedit.codReserva)
              .then(
                function(data) {
                    if(data.object != null) {
                      var photo = data.object[0].comprovante;
                      $scope.reserva.comprovante = photo;
                    } else {
                      $scope.notcomprovante = 'Não há comprovante cadastrado!'
                    }
                    $scope.openModal();
                    $ionicLoading.hide();
                },
                function(error) {
                    $scope.showAlert("Tente novamente");
                    console.log(error)
                    $ionicLoading.hide();
                }
              );
            }
          }

          $scope.openModal = function() {
            $scope.modal.show();
          };

          $scope.closeModal = function() {
            $scope.modal.hide();
          };



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
