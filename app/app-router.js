/** @ngInject */
export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl as vm',
        template: require('./home/home.html')
      })
      .state('register-policy', {
        url: '/register',
        controller: 'RegisterPolicyCtrl as vm',
        template: require('./register-policy/register-policy.html')
      })
      .state('my-profile', {
        url: '/myProfile',
        controller: 'MyProfileCtrl as vm',
        template: require('./my-profile/my-profile.html'),
        resolve: {
          profile: () => {
            return {
              firstName: 'John',
              lastName: 'Smith',
              phoneNumber: '(555) 321-4925',
              email: 'johnsmith@gmail.com',
              addressLine1: '123 Main St',
              addressLine2: null,
              city: 'St. Louis',
              state: 'MO',
              zip: '63103',
              beneficiary: {
                firstName: 'Jane',
                lastName: 'Smith'
              },
              policyType: 'Life',
              coverage: 100000
            };
          }
        }
      });
};