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
    .filter('truncate', [function () {
        return function (input, maxlen) {
            if (input.length > maxlen) {
                return input.substring(0, maxlen) + "...";
            }
            return input;
        };

    }])
    .directive('elastic', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function () {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }])
    .directive('tableStatic', [function () {
        return {
            restrict: 'EA',
            transclude: true,
            templateUrl: 'components/templates/table-static.html'
        };
    }])
    .directive('chatarea', [function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('keydown', function (event) {
                    var code = event.keyCode || event.which;

                    if (code === 13) {
                        if (!event.shiftKey) {
                            event.preventDefault();
                            scope.$apply(attrs.chatarea);
                        }
                    }
                });
            }
        };
    }])
    .directive('select', ['$interpolate', function ($interpolate) {
        return {
            restrict: 'E',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var defaultOptionTemplate;
                scope.defaultOptionText = attrs.ngDefault || '';
                defaultOptionTemplate = '<option value disabled selected style="display: none;">{{defaultOptionText}}</option>';
                elem.prepend($interpolate(defaultOptionTemplate)(scope));
            }
        };
    }])
    .directive('sorter', [function () {
        return {
            restrict: 'EA',
            scope: {
                model: '=ngModel',
                callback: '=callback'
            },
            controller: ['$scope', function ($scope) {
                this.setPageable = function (pageable) {
                    $scope.callback(pageable);
                };
                this.getPageable = function () {
                    return $scope.model;
                };
            }]
        };
    }])
    .directive('sort', [function () {
        return {
            restrict: 'A',
            require: '^sorter',
            scope: {
                sort: '@sort'
            },
            transclude: true,
            templateUrl: 'components/templates/sort.html',
            link: function (scope, elements, attrs, ctrl) {
                scope.click = function () {
                    var pageable = _.pick(ctrl.getPageable(), ['size', 'sort']);

                    if (_.isNil(pageable.sort)) {
                        pageable.sort = [scope.sort + ',asc'];
                    } else {
                        if (pageable.sort[0].property === scope.sort) {
                            pageable.sort = [scope.sort + ',' + (_.lowerCase(pageable.sort[0].direction) === 'asc' ? 'desc' : 'asc')];
                        } else {
                            pageable.sort = [scope.sort + ',asc'];
                        }
                    }
                    ctrl.setPageable(_.extend(pageable, {
                        page: ctrl.getPageable().number
                    }));
                };
                scope.active = function () {
                    return _.get(ctrl.getPageable(), 'sort[0].property') === scope.sort;
                };
                scope.direction = function () {
                    var direction = _.get(ctrl.getPageable(), 'sort[0].direction');
                    return scope.active() ? (direction ? _.lowerCase(direction) : 'desc') : 'desc';
                };
            }
        };
    }])
    .directive('pagination', [function () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/templates/pagination.html',
            scope: {
                model: '=ngModel',
                callback: '=callback'
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                scope.sizeOptions = [10, 20, 40];
                var update = function (extend) {
                    var newPageable = _.pick(scope.model, ['size', 'sort']);
                    newPageable.sort = newPageable.sort ? _.map(newPageable.sort, function (e) {
                        return e.property + ',' + _.lowerCase(e.direction);
                    }) : undefined;
                    newPageable.page = newPageable.number;
                    _.extend(newPageable, extend);
                    scope.callback(newPageable);
                };
                scope.next = function () {
                    //Stop if no next
                    if (scope.model.last) {
                        return false;
                    }
                    update({ page: scope.model.number + 1 });
                };
                scope.prev = function () {
                    //Stop if no previous
                    if (scope.model.first) {
                        return false;
                    }
                    update({ page: scope.model.number - 1 });
                };
                scope.goto = function (i) {
                    update({ page: i });
                };
                //Get int as array
                scope.counter = function () {
                    return new Array(_.get(scope, 'model.totalPages', 0));
                };
                scope.$watch('model.size', function (size) {
                    if (!_.isNil(size)) {
                        update({ size: size });
                    }
                });
            }
        };
    }])
    .directive('message', [function () {
        return {
            restrict: 'EA',
            scope: { message: '=messageData' },
            templateUrl: 'components/templates/message.html',
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {

            }
        };
    }])

    .directive('socialLinker', ['DataService', 'BusinessConfig', '$auth', '$state', '$uibModal', function (DataService, BusinessConfig, $auth, $state, $uibModal) {
        return {
            restrict: 'AE',
            transclude: true,
            templateUrl: function (elem, attr) {
                return 'components/templates/social-linker.html';
            },
            scope: {
                model: '=ngModel',
                fromState: '@fromState',
                onDone: '=?onDone'
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                scope.mediaList = [];

                //search model for media
                scope.hasMedia = function (mediaId) {
                    var f = _.find(scope.model, function (ec) {
                        return _.get(ec, "media.mediaId") === mediaId;
                    });
                    if (f) {
                        return true;
                    }
                    return false;
                };


                DataService.getMedium().then(function (mediumResponse) {
                    scope.mediaList = mediumResponse.data;
                });


                scope.startAuthFlow = function (mediaId) {
                    if (mediaId == 'youtube') {
                        mediaId = 'google';
                    }
                    $auth.authenticate(mediaId)
                        .then(function (response) {
                            var linkedProfile = response.data;
                            if (mediaId == 'facebook') {
                                $uibModal.open({
                                    templateUrl: 'components/templates/social-linker-modal.html',
                                    controller: ['$scope', 'authData', '$uibModalInstance', function ($scope, authData, $uibModalInstance) {
                                        $scope.pages = authData.pages;
                                        $scope.formData = {
                                            selectedPage: null
                                        };
                                        $scope.minFollower = BusinessConfig.MIN_FOLLOWER_COUNT;
                                        $scope.choosePage = function (page) {
                                            var authobject = {
                                                pages: [page],
                                                pageId: page.id,
                                                media: authData.media,
                                                email: authData.email,
                                                profilePicture: page.picture,
                                                name: page.name,
                                                id: authData.id
                                            };
                                            $uibModalInstance.close(authData);
                                        };
                                    }],
                                    resolve: {
                                        authData: function () {
                                            return linkedProfile;
                                        }
                                    }
                                })
                                    .result.then(function (authData) {
                                        //Afterward,
                                        scope.model.push({
                                            media: linkedProfile.media || { mediaId: mediaId },
                                            socialId: authData.id,
                                            pageId: authData.pageId,
                                            followerCount: authData.pages[0].count
                                        });
                                        if (scope.onDone) scope.onDone();
                                    });
                            } else {
                                scope.model.push({
                                    media: linkedProfile.media || { mediaId: mediaId },
                                    socialId: linkedProfile.id,
                                    followerCount: linkedProfile.pages[0].count,
                                    pageId: null
                                });
                                if (scope.onDone) scope.onDone();
                            }
                        })
                        .catch(function (err) {
                            console.log("Linking failed", err);
                        });

                };
            }
        };
    }])
    .directive('cardProposalDetail', ['ProposalService', function (ProposalService) {
        return {
            restrict: 'AE',
            transclude: true,
            templateUrl: 'components/templates/card-proposal-detail.html',
            scope: {
                proposal: '=ngModel'
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                scope.intersectMedia = function (media, mediaInfluencer) {
                    return _.intersectionBy((mediaInfluencer || []).map(function (mi) {
                        mi.mediaId = mi.media.mediaId;
                        return mi;
                    }), media, 'mediaId');
                };
            }
        };
    }])
    .directive('cardBrandProfile', [function () {
        return {
            restrict: 'AE',
            transclude: true,
            templateUrl: 'components/templates/card-brand-profile.html',
            scope: {
                brand: '=ngModel'
            },
            link: function(scope, element, attrs, ctrl, transclude) {

            }
        };
    }])
    .directive('cardInfluencerProfile', [function () {
        return {
            restrict: 'AE',
            transclude: true,
            templateUrl: 'components/templates/card-influencer-profile.html',
            scope: {
                influencer: '=ngModel',
                _showSocialData: '=?showSocialData'
            },
            link: function (scope, element, attrs, ctrl, transclude) {

                    if(scope._showSocialData === false){
                        scope.showSocialData = false;
                    }else if(scope._showSocialData === true){
                        scope.showSocialData = true;
                    }else{
                        scope.showSocialData = true;
                    }

                

                scope.joinCat = function (A) {
                    return A.map(function(o){
                        return o.categoryName;
                    }).join(", ");
                };
            }
        };
    }])
    .directive('ncDropdown', [function () {
        return {
            restrict: 'A',
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                console.log(attrs);
            }
        };
    }])
    .directive('ncDataDropdown', ['DataService', function (DataService) {
        return {
            restrict: 'AE',
            transclude: true,
            templateUrl: 'templates/components/nc-data-dropdown.html',
            scope: {
                model: '=ngModel',
                serviceName: '@'
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                DataService[scope.serviceName]().then(function (response) {
                    scope.ds = response.data;
                });
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

                if (!scope.alert) {
                    //Prototype mode
                    scope.alert = new NcAlert();
                    var transcludes = [];
                    for (var i = 0; i < transclude().length; i++) {
                        transcludes.push(transclude()[i].outerHTML);
                    }
                    scope.alert[scope.type || 'info'](transcludes.join(""));
                }

                scope.$watch('alert', function (newObj) {
                    scope.alert.element = element;
                });

                if (!scope.closable) {
                    scope.closable = function () {
                        return true;
                    };
                }
            }
        };
    }])
    .factory('NcAlert', ['$document', '$timeout', 'smoothScroll', '$window', function ($document, $timeout, smoothScroll, $window) {
        return function () {
            var vm = this;
            this.type = 'danger';
            this.show = false;
            this.close = function () {
                this.show = false;
            };
            //show bar
            this.open = function (success, msg, color) {
                color = _.isNil(color) ? 'danger' : color;
                this.type = (success) ? 'success' : color;

                if (msg) {
                    this.message = msg;
                } else {
                    this.message = success ? 'Success' : 'Unknown Failure';
                }

                this.show = true;
            };
            //show red bar
            this.danger = function (msg, toElm, scroll) {
                console.log(msg);
                this.open(false, msg);

                $timeout(function () {
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
            this.success = function (obj, toElm) {
                this.open(true, obj);

                $timeout(function () {
                    // var section = vm.element || $document;
                    // smoothScroll($elem[0], $attrs);
                    $window.scrollTo(0, 0);
                }, 10);
            };

            this.info = function (obj, toElm) {
                this.open(false, obj, 'info');

                $timeout(function () {
                    // var section = vm.element || $document;
                    // smoothScroll($elem[0], $attrs);
                    $window.scrollTo(0, 0);
                }, 10);

            };


            this.warning = function (obj, toElm) {
                this.open(false, obj, 'warning');

                $timeout(function () {
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
    .directive('zoneHeader', [function () {
        //To Do: make historyback to True/False
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                historyback: '=?'
            },
            templateUrl: 'components/templates/zone-header.html',
            link: function (scope, element, attrs, ctrl, transclude) {
                scope.history = {
                    back: function () {
                        history.back();
                    }
                };
                /*element.on('click', function() {
                  history.back();
                  scope.$apply();
                });*/
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
                if (!scope.onClick) {
                    scope.onClick = function () {
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
                accessor: '&?' //function that defines how to access the url of the model
            },
            templateUrl: 'components/templates/uploader-thumb.html',
            link: function (scope, elem, attrs, form) {

                if (!scope.accessor) {
                    scope.accessor = function (data) {
                        if (!scope.model) return false;
                        return data.url;
                    };
                }

                scope.remove = function (index) {
                    scope.model = null;
                };

                scope.loadingImage = false;
                scope.upload = function (file) {
                    scope.loadingImage = true;
                    var evtHandler = function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        scope.progressPercentage = progressPercentage;
                    };

                    $uploader.upload('/resources', { file: file }, evtHandler)
                        .then(function (data) {
                            scope.loadingImage = false;
                            scope.model = data;
                        });
                };

            }
        };
    }])
    .directive('multiCategorySelector', ['DataService', function (DataService) {
        return {
            restrict: 'AE',
            scope: {
                maxColumns: '=?maxColumns',
                maxSelected: '=?maxSelected',
                model: '=ngModel'
            },
            templateUrl: 'components/templates/multi-category-selector.html',
            link: function (scope, elem, attrs, form) {
                if (!scope.maxColumns) {
                    scope.maxColumns = 4;
                }

                if (!scope.maxSelected) {
                    scope.maxSelected = 3;
                }

                if (!scope.model) {
                    scope.model = [];
                }

                DataService.getCategories().then(function (cats) {
                    scope.categoriesChunk = _.chunk(cats.data, Number(scope.maxColumns));
                    update();
                });

                var update = function () {
                    if (_.isNil(scope.model) || _.isNil(scope.categoriesChunk)) {
                        return;
                    }
                    console.log(scope.model, scope.categoriesChunk);
                    _.forEach(scope.categoriesChunk, function (chunk) {
                        _.forEach(chunk, function (so) {
                            if (_.findIndex(scope.model, function (e) {
                                return e.categoryId == so.categoryId;
                            }) >= 0) {
                                so._selected = true;
                            } else {
                                so._selected = false;
                            }
                        });
                    });
                };

                scope.$watch('model', update);

                scope.activate = function (so) {
                    if (so._selected) {
                        so._selected = false;
                        _.remove(scope.model, function (o) {
                            return _.get(o, 'categoryName') == _.get(so, 'categoryName');
                        });
                    } else {
                        if (scope.model.length < scope.maxSelected) {
                            so._selected = true;
                            scope.model.push(so);
                        }
                    }
                };

                scope.getValue = function (obj) {
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
                accessor: '&?' //function that defines how to access the url of the model
            },
            templateUrl: function (elem, attr) {
                if (attr.template) {
                    return attr.template;
                }

                return 'components/templates/uploader-multi.html';
            },
            link: function (scope, elem, attrs, form) {
                if (!(scope.model instanceof Array)) {
                    console.error("Model is not array.");
                }

                if (!scope.accessor) {
                    scope.accessor = function (data) {
                        if (!data) return false;
                        return data.url;
                    };
                }

                scope.remove = function (index) {
                    scope.model.splice(index, 1);
                };

                scope.loadingImage = false;
                scope.upload = function (file) {
                    scope.loadingImage = true;
                    scope.progressPercentage = 0;
                    var evtHandler = function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        scope.progressPercentage = progressPercentage;
                    };

                    $uploader.upload('/resources', { file: file }, evtHandler)
                        .then(function (data) {
                            scope.loadingImage = false;
                            data._name = file.name;
                            scope.model.push(data);
                        });
                };

            }
        };
    }]);
