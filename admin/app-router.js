/** @ngInject */
export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl as vm',
        template: require('./home/home.html'),
        resolve: {
          policies: ($http) => {
            return $http.get('/api/getPolicies').then(response => {
              return response.data;
            });
          }
        }
      })
      .state('policy-details', {
        url: '/policy-details/:policyNumber',
        controller: 'PolicyDetailsCtrl as vm',
        template: require('./policy-details/policy-details.html'),
        resolve: {
          policy: ($http, $stateParams) => {
            return $http.get(`/api/getPolicy/${$stateParams.policyNumber}`).then(response => {
              return response.data;
            });
          }
        }
      });
};