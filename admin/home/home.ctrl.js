/** @ngInject */
export default function ($state, $firebaseObject) {
  var vm = this;

  var ref = new Firebase("https://policy-alert.firebaseio.com/policies");
  $scope.policies = $firebaseObject(ref);

  vm.registerPolicy = function () {
    $state.go('register-policy');
  };
};