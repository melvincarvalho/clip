var AUTHENDPOINT = "https://databox.me/";
var PROXY = "https://rww.io/proxy.php?uri={uri}";
var TIMEOUT = 5000;
var DEBUG = true;
// Namespaces
var RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
var RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
var OWL = $rdf.Namespace("http://www.w3.org/2002/07/owl#");
var PIM = $rdf.Namespace("http://www.w3.org/ns/pim/space#");
var UI = $rdf.Namespace("http://www.w3.org/ns/ui#");
var DCT = $rdf.Namespace("http://purl.org/dc/terms/");
var LDP = $rdf.Namespace("http://www.w3.org/ns/ldp#");
var SOLID = $rdf.Namespace("http://www.w3.org/ns/solid/app#");
var VCARD = $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
var FAV = $rdf.Namespace("http://www.eclap.eu/schema/eclap/");

var scope = {};
var gg;

$rdf.Fetcher.crossSiteProxyTemplate=PROXY;

var App = angular.module('Clip', [
    'lumx'
]);

App.controller('Main', function($scope, $http, $timeout, LxNotificationService, LxProgressService, LxDialogService) {
    $scope.app = {};

    // save app configuration if it's the first time the app runs
    $scope.initApp = function() {
    };

});

App.directive('clip',function(){
    return {
      replace : true,
      restrict : 'E',
      templateUrl: 'app/views/clip.tpl.html'
    };
});
