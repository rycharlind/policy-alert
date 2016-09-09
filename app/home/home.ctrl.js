/** @ngInject */
export default function ($state) {
  var vm = this;

  vm.registerPolicy = function () {
    $state.go('register-policy');
  };
};