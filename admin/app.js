import 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-messages';
import 'angular-material';
import 'angular-ui-router';
import Firebase from 'firebase';
import 'angularfire';
import 'lodash';
require('angular-material/angular-material.css');
require('font-awesome/css/font-awesome.css');
require('./app.scss');
import AppRouter from './app-router.js'
import HeaderComp from './header/header.comp.js';
import HeaderCtrl from './header/header.ctrl.js';
import HomeCtrl from './home/home.ctrl.js';
import PolicyDetailsCtrl from './policy-details/policy-details.ctrl.js';

let module = angular.module('adminApp', ['ui.router', 'ngMaterial', 'ngMessages', 'firebase'])
    .component('paHeader', HeaderComp)
    .controller('HeaderCtrl', HeaderCtrl)
    .controller('HomeCtrl', HomeCtrl)
    .controller('PolicyDetailsCtrl', PolicyDetailsCtrl);

module.config(AppRouter);

module.config(($mdThemingProvider) => {
  $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange');
});

export default module;


