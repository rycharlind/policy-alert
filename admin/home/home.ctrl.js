/** @ngInject */
export default function ($state, policies) {
  var vm = this;

  vm.policies = policies;

  vm.registerPolicy = function () {
    $state.go('register-policy');
  };
};