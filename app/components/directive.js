/* jshint node: true */
'use strict';

angular.module('myApp.directives', [])

    .directive('testBox', [function () {
        return {
            restrict: 'EA',
            scope: false,
            templateUrl: 'components/templates/testbox.html',
            link: function (scope, element, attrs, ctrl, transclude) {
                //this fucntion gets calld when template is loaded

            }
        };
    }])

    .directive('alertBox', [function () {
        return {
            restrict: 'EA',
            transclude: true,
            templateUrl: function (elem, attr) {
                //Specify alertbox-success, alertbox-failure, alertbox-info etc.
                return 'components/templates/alertbox.html';
            },
            scope: {
                type: "@type",
                closable: '&?',
                show: '&?showOn'
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                //this fucntion gets calld when template is loaded
                if (!scope.show) {
                    scope.show = function(){
                        return false;   
                    };
                }
                if (!scope.closable) {
                    scope.closable = function(){
                        return true;   
                    };
                }

                scope.close = function () {
                    scope.show = function(){
                        return false;
                    };
                };
            }
        };
    }])

    .directive('cardCampaignHeader', [function () {
        return {
            restrict: 'EA',
            scope: { campaign: '=' },
            templateUrl: 'components/templates/card-campaign-header.html',
            link: function (scope, element, attrs, ctrl, transclude) {

            }
        };
    }])

    .directive('cardCampaignListItem', [function () {
        return {
            restrict: 'EA',
            scope: {
                campaign: '=',
                linkTo: '@'
            },
            templateUrl: 'components/templates/card-campaign-list-item.html',
            link: function (scope, element, attrs, ctrl, transclude) {

            }
        };
    }])
    .directive('uploaderThumb', ['$uploader', function ($uploader) {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                width: '=',
                height: '=',
                model: '=ngModel',
                accessor: '&?'  //function that defines how to access the url of the model
            },
            templateUrl: 'components/templates/uploader-thumb.html',
            link: function (scope, elem, attrs, form) {

                if (!scope.accessor) {
                    scope.accessor = function (data) {
                        if (!scope.model) return false;
                        return data.url;
                    };
                }

                scope.loadingImage = false;
                scope.upload = function (file) {
                    scope.loadingImage = true;
                    var evtHandler = function(evt){
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        scope.progressPercentage = progressPercentage;
                    };
                    
                    $uploader.upload('/resources', {file: file}, evtHandler)
                    .then(function (data) {
                            scope.loadingImage = false;
                            scope.model = data;
                    });
                };

            }
        };
    }])
    .directive('uploaderMulti', ['$uploader', function ($uploader) {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                model: '=ngModel',
                accessor: '&?'  //function that defines how to access the url of the model
            },
            templateUrl: 'components/templates/uploader-multi.html',
            link: function (scope, elem, attrs, form) {
                if(!(scope.model instanceof Array)){
                    console.error("Model is not array.");
                }

                if (!scope.accessor) {
                    scope.accessor = function (data) {
                        if (!data) return false;
                        return data.url;
                    };
                }

                scope.remove = function(index){
                    scope.model.splice(index, 1);
                };

                scope.loadingImage = false;
                scope.upload = function (file) {
                    scope.loadingImage = true;
                    scope.progressPercentage = 0;
                    var evtHandler = function(evt){
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        scope.progressPercentage = progressPercentage;
                    };
                    
                    $uploader.upload('/resources', {file: file}, evtHandler)
                    .then(function (data) {
                            scope.loadingImage = false;
                            data._name = file.name;
                            scope.model.push(data);
                    });
                };

            }
        };
    }]);
