/** @ngInject */
export default function ($state, $http, policy) {
  var vm = this;

  vm.policy = policy;
  
  vm.updateInfo = function() {
  	$http.post('/api/updatePolicyInfo', {}).then(function() {
  		$state.go('home');
  	});
  }

};