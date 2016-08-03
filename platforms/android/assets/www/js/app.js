(function() {
    'use strict';
    var app = angular.module('savingtime', ['ionic',
                                          'ngCordova',
                                          'ui.mask',
                                        /* Directives */
                                        /* Controllers */
                                        'main.controller',

                                        'mesas.controller',
                                        'cadmesas.controller',
                                        'consmesas.controller',
                                        'consmesasstatus.controller',
                                        'consmesascap.controller',
                                        'consmesastodas.controller',
                                        'editmesas.controller',

                                        'checkin.controller',
                                        'filaatendimento.controller',
                                        'filaespera.controller',
                                        'consultarmesas.controller',
                                        'gerenciar.controller',
                                        'disponibilidade.controller',
                                        'relatorio.controller',
                                        'settings.controller',
                                        'onboarding.controller',

                                        'reserva.controller',
                                        'cadreserva.controller',
                                        'constodasreserva.controller',
                                        'consdatareserva.controller',
                                        'consccreserva.controller',
                                        'editarreserva.controller',
                                        'detalhes.controller',

                                        'mesas.service',
                                        'reserva.service',
                                        'filas.service',
                                        'checkin.service',
                                        'relatorio.service',
                                        'detalhes.service',

                                        'ionic-datepicker'

                                        /* Factories */]);


	app.run(function($ionicPlatform, $state) {

		document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {


		}


    	$ionicPlatform.ready(function() {

    	})
	});


	app.config(function($stateProvider, $urlRouterProvider, $locationProvider,
					 $compileProvider, $ionicConfigProvider, ionicDatePickerProvider) {

    $ionicConfigProvider.views.swipeBackEnabled(false);

      var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: [6]
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

    $stateProvider

		.state('main', {
			name: 'main',
			url: '/main',
			templateUrl: 'main/main.view.html',
			controller: 'MainCtrl'
		})

      .state('checkin', {
  			name: 'checkin',
  			url: '/checkin',
  			templateUrl: 'check-in/checkin.view.html',
  			controller: 'CheckinCtrl'
  		})

      .state('checkin/comreserva', {
  			name: 'checkincomreserva',
  			url: '/checkin/comreserva',
  			templateUrl: 'check-in/checkin-comreserva.view.html',
  			controller: 'CheckinCtrl'
  		})


    .state('filaespera', {
			name: 'filaespera',
			url: '/filaespera',
			templateUrl: 'fila/filaespera.view.html',
			controller: 'FilaesperaCtrl'
		})

    .state('relatorio', {
			name: 'relatorio',
			url: '/relatorio',
			templateUrl: 'relatorio/relatorio.view.html',
			controller: 'RelatorioCtrl'
		})

    .state('filaatendimento', {
			name: 'filaatendimento',
			url: '/filaatendimento',
			templateUrl: 'fila/filaatendimento.view.html',
			controller: 'FilaatendimentoCtrl'
		})

    .state('consultarmesas', {
			name: 'consultarmesas',
			url: '/consultarmesas',
			templateUrl: 'consultar-mesas/consultarmesas.view.html',
			controller: 'ConsultarmesasCtrl'
		})

    .state('mesas', {
			name: 'mesas',
			url: '/mesas',
			templateUrl: 'mesas/mesas.view.html',
			controller: 'MesasCtrl'
		})

    .state('tabres', {
     abstract: true,
     url: "/tabres",
     templateUrl: 'reserva/consultar/reservas-tab.view.html'
     })

     .state('tabres.todasres', {
       url: '/todasres',
       views: {
        'todasres': {
          templateUrl: 'reserva/consultar/todas/todas-reservas.view.html',
          controller: 'ConsTodasReservasCtrl'
         }
       }
     })

     .state('tabres.pordata', {
       url: '/pordata',
       views: {
        'pordata': {
          templateUrl: 'reserva/consultar/data/data-reservas.view.html',
          controller: 'ConsDataReservasCtrl'
         }
       }
     })

     .state('tabres.porcodoucpf', {
       url: '/porcodoucpf',
       views: {
        'porcodoucpf': {
          templateUrl: 'reserva/consultar/cpf-ou-cod/cons-cc-reservas.view.html',
          controller: 'ConsCCReservasCtrl'
         }
       }
     })

    .state('tab', {
     abstract: true,
     url: "/tab",
     templateUrl: 'mesas/consultar/cons-mesas.view.html'
     })

    .state('tab.todasmesas', {
      url: '/todasmesas',
      views: {
       'todasmesas': {
         templateUrl: 'mesas/consultar/todas/tab-todas.view.html',
         controller: 'ConsMesasCtrl'
        }
      }
    })

    .state('tab.porstatus', {
      url: '/porstatus',
      views: {
       'porstatus': {
         templateUrl: 'mesas/consultar/status/tab-status.view.html',
         controller: 'ConsMesasStatusCtrl'
        }
      }
    })

    .state('tab.porcapacidade', {
      url: '/porcapacidade',
      views: {
       'porcapacidade': {
         templateUrl: 'mesas/consultar/capacidade/tab-capacidade.view.html',
         controller: 'ConsMesasCapCtrl'
        }
      }
    })

    .state('edit/mesas', {
			name: 'editmesas',
      cache: false,
			url: '/edit/mesas',
			templateUrl: 'mesas/editar/edit-mesas.view.html',
			controller: 'EditMesasCtrl'
		})

    .state('cadmesas', {
			name: 'cadmesas',
			url: '/cadmesas',
			templateUrl: 'mesas/cadastrar/cad-mesas.view.html',
			controller: 'CadMesasCtrl'
		})

    .state('gerenciar', {
			name: 'gerenciar',
			url: '/gerenciar',
			templateUrl: 'gerenciar/gerenciar.view.html',
			controller: 'GerenciarCtrl'
		})

    .state('disponibilidade', {
			name: 'disponibilidade',
			url: '/disponibilidade',
			templateUrl: 'disponibilidade/disponibilidade.view.html',
			controller: 'DisponibilidadeCtrl'
		})

    .state('reserva', {
			name: 'reserva',
			url: '/reserva',
			templateUrl: 'reserva/cadastrar/cadreserva.view.html',
			controller: 'CadReservaCtrl'
		})

    .state('gerenciar/reserva', {
			name: 'gerenciarreserva',
			url: '/gerenciar/reserva',
			templateUrl: 'reserva/gerenciarreserva.view.html',
			controller: 'ReservaCtrl'
		})

    .state('editar/reserva', {
			name: 'editarreserva',
			url: '/editar/reserva',
			templateUrl: 'reserva/editar/editar-reserva.view.html',
			controller: 'EditReservaCtrl'
		})

    .state('settings', {
			name: 'settings',
			url: '/settings',
			templateUrl: 'settings/settings.view.html',
			controller: 'SettingsCtrl'
		})

    .state('onboarding', {
      name: 'onboarding',
			url: "/onboarding",
			controller: 'OnboardingController',
			templateUrl: "onboarding/onboarding.view.html"
		})

    .state('detalhes', {
      name: 'detalhes',
			url: "/detalhes",
			controller: 'DetalhesCtrl',
			templateUrl: "detalhes/detalhes.view.html"
		});

    if(localStorage.getItem('VIU_ONB') == true) {
      $urlRouterProvider.otherwise('/main');
    } else {
      $urlRouterProvider.otherwise('/onboarding');
    }

	});

})();
