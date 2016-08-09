/* jshint node: true */
'use strict';

angular.module('myApp.directives', [])

    .directive('ncAlert', ['NcAlert', function (NcAlert) {
        return {
            restrict: 'A',
            transclude: true,
            templateUrl: function (elem, attr) {
                //Specify alertbox-success, alertbox-failure, alertbox-info etc.
                return 'components/templates/nc-alert.html';
            },
            scope: {
                closable: '&?',
                alert: '=?ncAlert',
                type: '@?type'
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                
                if(!scope.alert){
                    //Prototype mode
                    scope.alert = new NcAlert();
                    var transcludes = [];
                    for(var i = 0; i < transclude().length; i++){
                        transcludes.push(transclude()[i].outerHTML);
                    }
                    scope.alert[scope.type || 'info'](transcludes.join(""));
                }

                scope.$watch('alert', function(newObj) {
					scope.alert.element = element;
				});
                
                if (!scope.closable) {
                    scope.closable = function(){
                        return true;   
                    };
                }
            }
        };
    }])
    .factory('NcAlert', ['$document', '$timeout', 'smoothScroll', function($document, $timeout, smoothScroll) {
		return function() {
			var vm = this;
			this.type = 'danger';
			this.show = false;
			this.close = function() {
				this.show = false;
			};
			//show bar
			this.open = function(success, msg, color) {
				color = _.isNil(color) ? 'danger' : color;
				this.type = (success) ? 'success' : color;

				if(msg) {
					this.message = msg;
				} else {
					this.message = success ? 'Success' : 'Failure';
				}

				this.show = true;
			};
			//show red bar
			this.danger = function(msg, toElm, scroll) {
                console.log(msg);
				this.open(false, msg);
				
				$timeout(function() {
					var section = vm.element || $document;
					//should scroll to bar
					if(!_.isNil(scroll)) {
						if(scroll)
							smoothScroll(toElm ? vm.element[0] : $document[0].body, {
								container: toElm ? '.modal': null
							});
						
					} else {
						smoothScroll(toElm ? vm.element[0] : $document[0].body, {
							container: toElm ? '.modal': null
						});
					}
				}, 10);
			};
			//show green bar
			this.success = function(obj, toElm) {
				this.open(true, obj);
				
				$timeout(function() {
					var section = vm.element || $document;
					smoothScroll(toElm ? vm.element[0] : $document[0].body, {
						container: toElm ? '.modal': null
					});
				}, 10);
			};
            
			this.info = function(obj, toElm) {
				this.open(false, obj, 'info');
				
				$timeout(function() {
					var section = vm.element || $document;
					smoothScroll(toElm ? vm.element[0] : $document[0].body, {
						container: toElm ? '.modal': null
					});
				}, 10);
			};


			this.warning = function(obj, toElm) {
				this.open(false, obj, 'warning');
				
				$timeout(function() {
					var section = vm.element || $document;
					smoothScroll(toElm ? vm.element[0] : $document[0].body, {
						container: toElm ? '.modal': null
					});
				}, 10);
			};



			this.message = '';
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

                scope.remove = function(index){
                    scope.model = null;
                };

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
