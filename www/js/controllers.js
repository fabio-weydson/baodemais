angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})


.controller('Home', function($scope, $http, $ionicLoading, base_url, $log, $httpParamSerializerJQLike, $state, $stateParams, StorageService){
    $scope.load = true;
    StorageService.set();

    $scope.$watch('load',function(){
      if ($scope.load) {
        $ionicLoading.show({
          template: 'Aguarde, carregando informações',
        })
      }
      else {
        $ionicLoading.hide();
      }
    });

    $scope.deleteStorage  = function() {
      StorageService.remove();
    }
    loadEstados = function() {
      $ionicLoading.show({
        template: 'Carregando Informações',
      })
      $http({
        method: 'GET',
        url: base_url.get + '/api/getEstados',
      })
      .success(function(dados){
        $log.info(dados);
        $ionicLoading.hide();
        $scope.dados = dados;
      })
      .error(function(dados){
        $log.error(dados);
        $ionicLoading.show({
          template: 'Erro: conexão com a API não concluida.',
        })
      });
    }

    $scope.buscarPromocoes = function(data) {
       $log.info(data);
       $log.info($scope.dados);
       $state.go('app.busca',{CID_CodigoCidade:data.CID_CodigoCidade});
    }
    loadEstados();
})

.controller('Busca', function($scope, $http, $ionicLoading, base_url, $log, $httpParamSerializerJQLike, $state, $stateParams, StorageService){
  $log.warn('Ctrl: Busca');
  $log.info($stateParams);

  if (!$stateParams) {
    $state.go('app.home');
  }
  else {
    $http({
      method: 'POST',
      url: base_url.get + '/api/getEmpresas',
      data:  $httpParamSerializerJQLike($stateParams),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .success(function(dados){
      $ionicLoading.hide();
      $scope.empresas = dados;
      $log.info($scope.empresas);
    })
    .error(function(dados){
      $log.error(dados);
      $scope.load = false;
    });
  }

  $scope.promocao = function(id) {
    $state.go('app.promocao',{PRO_CodigoPromocao:id});
  }
})

.controller('Promocao', function($scope, $http, $ionicLoading, base_url, $log, $httpParamSerializerJQLike, $state, $stateParams, $ionicActionSheet, StorageService, $filter){
  $log.warn('Ctrl: Promocao');
  $log.info($stateParams);
  $scope.showCupom = false;

  $scope.class="hide";
  $scope.load = true;
  var storagePromocoes = StorageService.getAll();

  $scope.$watch('load',function(){
    $log.info($scope.class);
    if ($scope.load) {
      $scope.class="hide";
      $ionicLoading.show({
        template: 'Aguarde, carregando informações',
      })
    }
    else {
      $scope.class="show";
      $ionicLoading.hide();
    }
  });

  $scope.adicionarFavoritos = function(data) {
    var storagePromocoes = StorageService.getAll();

    if (storagePromocoes) {
      $log.info(storagePromocoes);
      StorageService.add(data);
      request();
    }
    else {
      StorageService.set();
      StorageService.add(data);
      $log.info(storagePromocoes);
      request();
    }
  }
 
  if (!$stateParams) {
    $scope.load = false;
    $state.go('app.home');
  }
  else {
    var request = function() {
      $http({
        method: 'POST',
        url: base_url.get + '/api/getPromocoes/' + $stateParams.PRO_CodigoPromocao,
        data:  $httpParamSerializerJQLike($stateParams),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .success(function(dados){
        $log.info(dados);
        $scope.dados = dados;
        $scope.load = false;
        if(storagePromocoes) {
          $log.info('Storage Encontrado:->');
          $log.info(storagePromocoes);
          angular.forEach(dados.promocoes, function(value, key) {
            var filtro = $filter('filter')(storagePromocoes, {PRO_CodigoPromocao:value.PRO_CodigoPromocao});
            if (filtro.length) {
              $log.info(value.PRO_CodigoPromocao + '-> Cupom Já utilizado');
              value.cupomStatus = 1;
            }
            else {
              $log.info(value.PRO_CodigoPromocao + '-> Novo Cupom');
              value.cupomStatus = 0;
            }
            /*$log.info(filtro);*/
          });
        }
        else {
          $scope.cupomStatus = 0;
        }
      })
      .error(function(dados){
        $log.error(dados);
        $scope.load = false;
      });
    }

    request();
  }
})

.controller('Cupons', function($scope, $http, $ionicLoading, base_url, $log, $httpParamSerializerJQLike, $state, $stateParams, $ionicActionSheet, StorageService, $filter){
  $log.warn('Ctrl: Promocao');
  var storagePromocoes = StorageService.getAll();

  if (storagePromocoes.length) {
    $scope.dados = storagePromocoes;
    $log.info($scope.dados);
    $scope.existeStorage = 1;
  }
  else {
    $scope.existeStorage = 0;
  }

  $scope.$watch('load',function(){
    if ($scope.load) {
      $ionicLoading.show({
        template: 'Aguarde, carregando informações',
      })
    }
    else {
      $ionicLoading.hide();
    }
  });

  $scope.navigate = function(page) {
    $state.go(page);
  }
})
