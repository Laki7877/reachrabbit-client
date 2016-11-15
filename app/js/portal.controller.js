require('./common.service');

angular.module('reachRabbitApp.portal.controller', ['reachRabbitApp.common.service'])
    .controller('BrandSigninController', function ($scope, $rootScope, Config, $location, AccountService, UserProfile, $window, NcAlert) {
        var u = UserProfile.get();
        $scope.formData = {};

        $window.localStorage.removeItem('token');
        UserProfile.clear();

        $scope.alert = new NcAlert();

        $scope.login = function () {
            $location.search('message', 'nop');

            $scope.form.$setSubmitted();
            AccountService.getToken($scope.formData.username, $scope.formData.password)
                .then(function (response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    UserProfile.set(profileResp.data);

                    mixpanel.identify($scope.formData.username);
                    mixpanel.register({
                        "server": Config.CONFIG_NAME
                    });

                    //PNP wants brand name instead
                    profileResp.data.name = profileResp.data.brand.brandName;
                    mixpanel.people.set(profileResp.data);
                    mixpanel.track("User Login");

                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal#/brand-login");
                    var bounce = '/brand#/brand-campaign-list';
                    if ($location.search().bounce_route) {
                        bounce = ('/brand#' + $location.search().bounce_route);
                    }
                    $window.location.href = bounce;

                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    })
    .controller('AdminSigninController', function ($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
        var u = UserProfile.get();

        $scope.formData = {};
        $window.localStorage.removeItem('token');
        $scope.messageCode = $location.search().message;
        $scope.alert = new NcAlert();

        if ($scope.messageCode == "401") {
            $scope.alert.warning("<strong>401</strong> Unauthorized or Session Expired");
        }

        $scope.login = function () {
            $location.search('message', 'nop');
            $scope.form.$setSubmitted();
            AccountService.getAdminToken($scope.formData.username, $scope.formData.password)
                .then(function (response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;

                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    UserProfile.set(profileResp.data);

                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal#/admin-login");

                    var bounce = '/admin#/admin-transaction-history';
                    if ($location.search().bounce_route) {
                        bounce = ('/admin#' + $location.search().bounce_route);
                    }
                    $window.location.href = bounce;
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    })
    .controller('InfluencerSigninController', function ($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert, $auth, $state) {
        var u = UserProfile.get();
        $scope.formData = {};
        $window.localStorage.removeItem('token');
        $scope.alert = new NcAlert();
        var ref = $location.search().ref;

        $scope.login = function (username, password) {
            $location.search('message', 'nop');
            AccountService.getTokenInfluencer(username, password)
                .then(function (response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;

                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    mixpanel.identify(username);
                    mixpanel.people.set(profileResp.data);
                    mixpanel.track("User Login");
                    mixpanel.register({
                        "server": Config.CONFIG_NAME
                    });

                    $window.localStorage.profile = JSON.stringify(profileResp.data);
                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal#/influencer-login");
                    var bounce = '/influencer#/influencer-campaign-list';
                    if ($location.search().bounce_route) {
                        bounce = '/influencer#' + $location.search().bounce_route;
                    }
                    $window.location.href = bounce;
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };

        $scope.startAuthFlow = function (mediaId, ref) {
            $scope.minFollowerError = false;
            $window.localStorage.clear();
            $auth.authenticate(mediaId)
                .then(function (response) {
                    if (response.data.token) {
                        $rootScope.setUnauthorizedRoute("/portal#/influencer-login");
                        $window.localStorage.token = response.data.token;
                        AccountService.getProfile()
                            .then(function (profileResp) {
                                UserProfile.set(profileResp.data);
                                //Redirect change app
                                var bounce = '/influencer#/influencer-campaign-list';
                                if ($location.search().bounce_route) {
                                    bounce = '/influencer#' + $location.search().bounce_route;
                                }
                                $window.location.href = bounce;
                            });
                    } else {
                        if (mediaId == 'facebook') {
                            if (response.data.pages.length <= 0) {
                                $scope.alert.danger('คุณต้องมี Facebook Page เพื่อทำการสมัครด้วย Facebook');
                                return;
                            }
                            $state.go('influencer-signup-select-page', { authData: response.data, ref: ref });
                        } else {
                            if (response.data.pages[0].count < $scope.minFollower) {
                                $scope.minFollowerError = true;
                                return;
                            }
                            $state.go('influencer-signup-confirmation', { authData: response.data, ref: ref });
                        }
                    }



                });
        };
    })
    .controller('InfluencerJesusController', function ($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
        //For influencer gods
        $scope.alert = new NcAlert();
        $scope.login = function (username, password) {
            $location.search('message', 'nop');
            AccountService.getTokenInfluencer(username, password)
                .then(function (response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    UserProfile.set(profileResp.data);
                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal#/influencer-login");
                    $window.location.href = '/influencer#/influencer-campaign-list';
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    })
    .controller('InfluencerPortalController', function ($scope, $rootScope, NcAlert, $location, $auth, $state, $stateParams, AccountService, UserProfile, $window, BusinessConfig) {
        $scope.alert = new NcAlert();
        $scope.minFollower = BusinessConfig.MIN_FOLLOWER_COUNT;

        $scope.ref = $location.search().ref;

        if ($stateParams.alert) {
            $scope.alert[$stateParams.alert.type]($stateParams.alert.message);
        }

        $scope.bounce_route = $location.search().bounce_route;

        $scope.startAuthFlow = function (mediaId) {
            $scope.minFollowerError = false;
            $window.localStorage.clear();
            $auth.authenticate(mediaId)
                .then(function (response) {
                    // console.log('Response', response.data);
                    if (response.data.token) {
                        $rootScope.setUnauthorizedRoute("/portal#/influencer-login");

                        $window.localStorage.token = response.data.token;
                        AccountService.getProfile()
                            .then(function (profileResp) {
                                UserProfile.set(profileResp.data);
                                mixpanel.identify(profileResp.data.email);
                                mixpanel.people.set(profileResp.data);
                                mixpanel.register({
                                    "server": Config.CONFIG_NAME
                                });

                                //Redirect change app
                                var bounce = '/influencer#/influencer-campaign-list';
                                if ($scope.bounce_route) {
                                    bounce = '/influencer#/' + $scope.bounce_route;
                                }


                                mixpanel.track("User Login", {}, function () {
                                    $window.location.href = bounce;
                                });
                            });
                    } else {
                        if (mediaId == 'facebook') {
                            $state.go('influencer-signup-select-page', { authData: response.data, ref: $scope.ref, bounce_route: $scope.bounce_route });
                        } else {
                            if (response.data.pages[0].count < $scope.minFollower) {
                                $scope.minFollowerError = true;
                                return;
                            }

                            $state.go('influencer-signup-confirmation', { authData: response.data, ref: $scope.ref, bounce_route: $scope.bounce_route });
                        }
                    }

                });
        };
    }
    )
    .controller('InfluencerFacebookPageSelectionController', function ($scope, NcAlert, $auth, $state, $stateParams, InfluencerAccountService, BusinessConfig) {
        var authData = $stateParams.authData;
        var bounce = $stateParams.bounce_route;

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

            //go to cofnirmation page
            if ($stateParams.fromState) {
                return $state.go($stateParams.fromState, {
                    authData: authobject
                });
            }

            $state.go('influencer-signup-confirmation', {
                //reduce the pages array to just one array of page
                //that you selected
                authData: authobject,
                bounce_route: bounce
            });
        };
    })
    .controller('InfluencerSignUpEmailController', function ($scope, $location, $rootScope, NcAlert, $auth, $state, $stateParams, InfluencerAccountService, AccountService, UserProfile, $window, ResourceService, BusinessConfig, validator, util) {
        $scope.alert = new NcAlert();
        $scope.formData = {};
        $scope.bounce_route = $stateParams.bounce_route;
        $scope.register = function () {
            var o = validator.formValidate($scope.form);
            $scope.form.$setSubmitted();
            if (o) {
                $scope.alert.danger(o.message);
                return;
            }

            InfluencerAccountService.signup({
                name: $scope.formData.name,
                email: $scope.formData.email,
                password: $scope.formData.password,
                phoneNumber: $scope.formData.phoneNumber,
                ref: $location.search().ref
            })
                .then(function (response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    $rootScope.setUnauthorizedRoute("/portal#/influencer-login");
                    UserProfile.set(profileResp.data);

                    mixpanel.identify($scope.formData.email);
                    mixpanel.people.set(profileResp.data);
                    mixpanel.track("User Signup");
                    mixpanel.register({
                        "server": Config.CONFIG_NAME
                    });

                    $scope.form.$setPristine();
                    //Redirect change app

                    if ($scope.bounce_route) {
                        $window.location.href = '/influencer#/' + $scope.bounce_route;
                    } else {
                        $window.location.href = '/influencer#/influencer-profile-published?showToolbar';
                    }

                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    })
    .controller('InfluencerSignUpController', function ($scope, $location, $rootScope, NcAlert, $auth, $state, $stateParams, InfluencerAccountService, AccountService, UserProfile, $window, ResourceService, BusinessConfig, validator, util) {
        var profile = $stateParams.authData;
        $scope.alert = new NcAlert();
        $scope.form = {};

        var ref = $location.search().ref;
        if (ref) {
            $scope.ref = ref;
        }

        $scope.minFollower = BusinessConfig.MIN_FOLLOWER_COUNT;

        $scope.formData = profile;
        if (!profile) {
            $state.go('influencer-portal');
            return;
        }

        if ($scope.formData.pages[0].count < Number($scope.minFollower)) {
            //not meet requirement
            $state.go('influencer-portal', { alert: { type: 'danger', message: 'คุณต้องมีผู้ติดตามอย่างน้อย ' + $scope.minFollower + ' คนเพื่อสมัคร' } });
            return;
        }

        //Upload remote profile picture to get reosurce object
        ResourceService.uploadWithUrl(profile.profilePicture)
            .then(function (resource) {
                $scope.profilePictureResource = resource.data;
            });


        $scope.register = function () {
            var o = validator.formValidate($scope.form);
            $scope.form.$setSubmitted();
            if (o) {
                $scope.alert.danger(o.message);
                return;
            }

            InfluencerAccountService.signup({
                name: $scope.formData.name,
                email: $scope.formData.email,
                ref: $scope.ref,
                phoneNumber: $scope.formData.phoneNumber,
                influencerMedia: [{
                    media: $scope.formData.media,
                    socialId: $scope.formData.id,
                    followerCount: $scope.formData.pages[0].count,
                    pageId: $scope.formData.pageId || null
                }],
                password: $scope.formData.password,
                profilePicture: $scope.profilePictureResource
            })
                .then(function (response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    $rootScope.setUnauthorizedRoute("/portal#/influencer-login");
                    UserProfile.set(profileResp.data);

                    mixpanel.identify($scope.formData.email);
                    mixpanel.people.set(profileResp.data);
                    mixpanel.track("User Signup");
                    mixpanel.register({
                        "server": Config.CONFIG_NAME
                    });

                    $scope.form.$setPristine();

                    //Redirect change app
                    if ($stateParams.bounce_route) {
                        $window.location.href = '/influencer#/' + $stateParams.bounce_route;
                    } else {
                        $window.location.href = '/influencer#/influencer-profile-published?showToolbar';
                    }


                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }
    )
    .controller('BrandSignupController', function ($scope, $location, $state, $rootScope, BrandAccountService, AccountService, UserProfile, $window, NcAlert, util) {

        $scope.formData = {};
        $scope.form = {};
        $scope.alert = new NcAlert();

        $scope.submit = function (brand) {
            if (!$scope.form.$valid) {
                $scope.alert.danger('กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน');
                return;
            }

            brand.ref = $location.search().ref;
            $window.localStorage.clear();
            BrandAccountService.signup(brand)
                .then(function (response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    UserProfile.set(profileResp.data);
                    mixpanel.identify($scope.formData.email);
                    mixpanel.register({
                        "server": Config.CONFIG_NAME
                    });
                    profileResp.data.name = profileResp.data.brand.brandName;
                    mixpanel.people.set(profileResp.data);
                    mixpanel.track("User Signup");

                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal#/brand-login");
                    $scope.form.$setPristine();
                    $window.location.href = '/brand#/brand-campaign-list';
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };

    }
    );
