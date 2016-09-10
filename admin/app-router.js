/** @ngInject */
export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl as vm',
        template: require('./home/home.html')
      })
      .state('policy-details', {
        url: '/policy-details',
        controller: 'PolicyDetailsCtrl as vm',
        template: require('./policy-details/policy-details.html')
      });
};