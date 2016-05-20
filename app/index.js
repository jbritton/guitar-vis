
// css imports
require('./style.css');

// js imports
require('jquery/dist/jquery.js');
require('bootstrap/dist/js/bootstrap.js');

// app modules
const angular = require('angular');
const directives = require('./directives');
const services = require('./services');

// declare angular app module and register directives, services
var app = angular.module('app', []);
directives(app);
services(app);
