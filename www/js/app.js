// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ksSwiper', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.factory('base_url', function(){
  return {
    get: 'http://app.marketingmidia9.com.br'
  }
})

// create a new factory
.factory ('StorageService', function ($localStorage) {
  
  var _set = function() {
    $localStorage = $localStorage.$default({
      things: []
    });
  };

  var _getAll = function () {
    return $localStorage.things;
  };
  var _add = function (thing) {
    $localStorage.things.push(thing);
  }
  var _remove = function (thing) {
    $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
  }
  return {
    set: _set,
    getAll: _getAll,
    add: _add,
    remove: _remove
  };
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'Home'
      }
    }
  })
  .state('app.promocao', {
    url: '/promocao/:PRO_CodigoPromocao',
    views: {
      'menuContent': {
        templateUrl: 'templates/promocao.html',
        controller: 'Promocao'
      }
    }
  })

  .state('app.cupons', {
    url: '/cupons',
    views: {
      'menuContent': {
        templateUrl: 'templates/cupons.html',
        controller: 'Cupons'
      }
    }
  })
  .state('app.busca', {
    url: '/busca/:CID_CodigoCidade',
    views: {
      'menuContent': {
        templateUrl: 'templates/busca.html',
        controller: 'Busca'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
