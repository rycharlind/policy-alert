/** @ngInject */
export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl as vm',
        template: require('./home/home.html')
      });
};