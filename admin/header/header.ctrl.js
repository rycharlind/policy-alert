/** @ngInject */
export default function ($scope, $state) {
  var vm = this;
  vm.currentState = 'home';
  vm.$state = $state;

  $scope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams, option) => {
    switch (toState.name) {
      case 'home':
        vm.currentState = 'home';
        break;
      case 'my-profile':
        vm.currentState = 'my-profile';
        break;
      case 'register-policy':
        vm.currentState = 'register-policy';
        break;
      default:
        vm.currentState = null;
        break;
    }
  });
};