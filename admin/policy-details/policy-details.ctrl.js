/** @ngInject */
export default function ($state, $http, $firebaseObject) {
  var vm = this;

  var ref = new Firebase("https://policy-alert.firebaseio.com/policies");
  $scope.data = $firebaseObject(ref);

  vm.updateInfo = function() {
  	$http.post('/api/updatePolicyInfo', {}).then(function() {
  		$state.go('home');
  	});
  }

};