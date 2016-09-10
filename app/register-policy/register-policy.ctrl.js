/** @ngInject */
export default function ($http, $state) {
  var vm = this;
  vm.states = ['REGISTRATION', 'IDENTITY', 'VERIFY', 'REVIEW'];
  vm.carriers = ['ACA Assurance',
    'Aegon Santander',
    'Allianz',
    'Allstate',
    'Aloha Care',
    'Arch Indemnity Insurance',
    'Avivi',
    'Axis Specialty Insurance',
    'Dean Health Plan Inc',
    'Delaware Life Insurance Co of New York',
    'Florida Health Care Plan Inc',
    'Grange Life Insurance Company',
    'Guardian Life',
    'Hollard',
    'Irish Life Assurance',
    'Just Retirement Life',
    'Liberty',
    'LifeNet Insurance Company',
    'Maine Employers Mutual Insurance Company',
    'ManuLife',
    'Mass Mutual',
    'Medica Health Plans of Wisconsin',
    'MetLife',
    'Mitsui Life Insurnace Company Limited',
    'National Teachers Associates Life Insurance Company',
    'Old Mutual Life Assurance Co',
    'Old Republic',
    'Phoenix Life Assurance Limited',
    'Pramerica Life',
    'Prudential Universal',
    'Samsung Life',
    'Security Life of Denver Intl Limited',
    'TransAmerica Life Intl',
    'United Farm Family Life'
  ];
  vm.stateIndex = 0;
  vm.policyToRegister = {
    lastName: null,
    birthDate: null,
    carrier: null,
    policyNumber: null
  };
  vm.identity = null;
  vm.identityChoice = null;
  vm.verificationCode = null;
  var policy = { firstName: 'John', lastName: 'Smith', phoneNumber: '(555) 321-4925', email: 'johnsmith@gmail.com', addressLine1: '123 Main St', addressLine2: null, city: 'St. Louis', state: 'MO', zip: '63103',
    beneficiary: {
      firstName: 'Jane',
      lastName: 'Smith'
    },
    type: 'Life',
    coverage: 100000 };
  vm.policy = policy;

  vm.registerPolicy = function () {
    $http.post('/api/registerPolicy', vm.policyToRegister).then(response => {
      vm.identity = response.data;
      vm.stateIndex++;
    });
  };

  vm.sendIdentityOption = function () {
    // vm.stateIndex++;
    $http.get('/api/sendVerificationCode').then(response => {
      vm.stateIndex++;
    });
  };

  vm.verifyCode = function () {
    $http.post('/api/validateVerificationCode', { code: vm.verificationCode }).then(response => {
      vm.policy = policy;
      vm.stateIndex++;
    });
  };

  vm.agreeToPolicy = function () {
    vm.policy.policyNumber = vm.policyToRegister.policyNumber || 1234;
    vm.policy.carrier = vm.policyToRegister.carrier;
    vm.policy.birthDate = vm.policyToRegister.birthDate;
    $http.post('/api/createPolicyContract', vm.policy).then(response => {
      $state.go('my-profile')
    });
  };
};