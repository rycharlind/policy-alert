import 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-messages';
import 'angular-material';
import 'angular-ui-router';
import 'lodash';
require('angular-material/angular-material.css');
require('font-awesome/css/font-awesome.css');
require('./app.scss');
import AppRouter from './app-router.js'
import HeaderComp from './header/header.comp.js';
import HeaderCtrl from './header/header.ctrl.js';
import HomeCtrl from './home/home.ctrl.js';

let module = angular.module('adminApp', ['ui.router', 'ngMaterial', 'ngMessages'])
    .component('paHeader', HeaderComp)
    .controller('HeaderCtrl', HeaderCtrl)
    .controller('HomeCtrl', HomeCtrl);

module.config(AppRouter);

module.config(($mdThemingProvider) => {
  $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange');
});

export default module;


