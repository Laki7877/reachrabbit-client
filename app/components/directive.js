/**
 * Routes
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Natt Phenjati <natt@phenjati.com>
 * @since      S04E01
 */
/* jshint node: true */
'use strict';

angular.module('myApp.directives', ['myApp.service'])
    .directive('socialLinker', ['DataService', '$auth', '$state', function (DataService, $auth, $state) {
        return {
            restrict: 'AE',
            transclude: true,
            templateUrl: function (elem, attr) {
                return 'components/templates/social-linker.html';
            },
            scope: {
                model: '=ngModel'
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                scope.mediaList = [];

                //search model for media
                scope.hasMedia = function(mediaId){
                    var f = _.find(scope.model, function(ec){
                        return _.get(ec, "media.mediaId") === mediaId;
                    });
                    if(f){
                        return true;
                    }
                    return false;
                };

                DataService.getMedium().then(function(mediumResponse){
                    scope.mediaList = mediumResponse.data;
                });

                scope.startAuthFlow = function(mediaId){
                    if(mediaId == 'youtube') {
                        mediaId = 'google';
                    }
                     $auth.authenticate(mediaId)
                        .then(function (response) {
                            var linkedProfile = response.data;
                            console.log('linkedProfile', linkedProfile);
                            if (mediaId == 'facebook') {
                                $state.go('influencer-signup-select-page', { authData: response.data });
                            } else {
                                scope.model.push({
                                    media: linkedProfile.media || { mediaId: mediaId },
                                    socialId: linkedProfile.id,
                                    pageId: null
                                });
                            }
                        })
                        .catch(function(err){
                            console.log("Linking failed", err);
                        });

                };
            }
        };
    }])
    .directive('ncAlert', ['NcAlert', function (NcAlert) {
        return {
            restrict: 'AE',
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
    .factory('NcAlert', ['$document', '$timeout', 'smoothScroll', '$window', function($document, $timeout, smoothScroll, $window) {
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
					this.message = success ? 'Success' : 'Unknown Failure';
				}

				this.show = true;
			};
			//show red bar
			this.danger = function(msg, toElm, scroll) {
                console.log(msg);
				this.open(false, msg);

				$timeout(function() {
					// var section = vm.element || $document;
					//should scroll to bar
					// if(!_.isNil(scroll)) {
					// 	if(scroll) smoothScroll($elem[0], $attrs);

					// } else {
					//     smoothScroll($elem[0], $attrs);
					// }
                    $window.scrollTo(0, 0);
				}, 10);
			};
			//show green bar
			this.success = function(obj, toElm) {
				this.open(true, obj);

				$timeout(function() {
					// var section = vm.element || $document;
					// smoothScroll($elem[0], $attrs);
                    $window.scrollTo(0, 0);
				}, 10);
			};

			this.info = function(obj, toElm) {
				this.open(false, obj, 'info');

				$timeout(function() {
					// var section = vm.element || $document;
					// smoothScroll($elem[0], $attrs);
                    $window.scrollTo(0, 0);
				}, 10);

			};


			this.warning = function(obj, toElm) {
				this.open(false, obj, 'warning');

				$timeout(function() {
					// var section = vm.element || $document;
					// smoothScroll($elem[0], $attrs);
                    $window.scrollTo(0, 0);
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
    .directive('cardCampaignThumbnail', [function () {
        return {
            restrict: 'EA',
            scope: {
                campaign: '=',
                onClick: '=?onClick'
            },
            templateUrl: 'components/templates/card-campaign-thumbnail.html',
            link: function (scope, element, attrs, ctrl, transclude) {
                if(!scope.onClick){
                    scope.onClick = function(){
                        //nop
                    };
                }
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
    .directive('multiCategorySelector', ['DataService', function(DataService){
        return {
            restrict: 'AE',
            scope: {
                maxColumns: '=?maxColumns',
                maxSelected: '=?maxSelected',
                model: '=ngModel'
            },
            templateUrl: 'components/templates/multi-category-selector.html',
            link: function(scope, elem, attrs, form){
                if(!scope.maxColumns){
                    scope.maxColumns = 4;
                }

                if(!scope.maxSelected){
                    scope.maxSelected = 3;
                }

                if(!scope.model){
                    scope.model = [];
                }

                DataService.getCategories().then(function(cats){
                    scope.categoriesChunk = _.chunk(cats.data, Number(scope.maxColumns));
                });

                scope.$watch('model', function() {
                  if(_.isNil(scope.model)) {
                    return;
                  }
                  _.forEach(scope.categoriesChunk, function(chunk) {
                    _.forEach(chunk, function(so) {
                      _.forEach(scope.model, function(cat) {
                        if(so.categoryName == cat.categoryName) {
                          so._selected = true;
                        } else {
                          so._selected = false;
                        }
                      });
                    });
                  });
                });

                scope.activate = function(so){
                    if(so._selected){
                        so._selected = false;
                        _.remove(scope.model, function(o){
                            return _.get(o, 'categoryName') == _.get(so, 'categoryName');
                        });
                    }else{
                        if(scope.model.length < scope.maxSelected){
                            so._selected = true;
                            scope.model.push(so);
                        }
                    }
                };

                scope.getValue = function(obj){
                    return _.get(obj, 'categoryName');
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
