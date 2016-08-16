/**
 * Controllers
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Natt Phenjati <natt@phenjati.com>
 * @since      S04E02
 */
/* jshint node: true */
'use strict';


/////////////// /////////////// /////////////// /////////////// ///////////////
/*
  _____  __  __  ____  _____ __   __
 | ____||  \/  ||  _ \|_   _|\ \ / /
 |  _|  | |\/| || |_) | | |   \ V /
 | |___ | |  | ||  __/  | |    | |
 |_____||_|  |_||_|     |_|    |_|
*/
/////////////// /////////////// /////////////// /////////////// ///////////////

angular.module('myApp.controller', ['myApp.service'])
    .controller('EmptyController', ['$scope', function ($scope) {
        $scope.testHit = function () {
            var scope = $scope;
            console.log("Test World");
        };
    }]);

/////////////// /////////////// /////////////// /////////////// ///////////////
/*
    INFLUENCER
*/
/////////////// /////////////// /////////////// /////////////// ///////////////

angular.module('myApp.influencer.controller', ['myApp.service'])
    .controller('InfluencerCampaignDetailController', ['$scope', '$state', '$stateParams', 'CampaignService', 'NcAlert', 'AccountService',
     function($scope, $state, $stateParams, CampaignService, NcAlert, AccountService){
        console.log($stateParams.campaignId);
        $scope.campaignNee = null;
        $scope.alert = new NcAlert();
        $scope.keywordMap = function(arr){
            if(!arr) return [];
            return arr.map(function(k){
                return k.keyword;
            });
        };
        
        CampaignService.getOne($stateParams.campaignId)
        .then(function(campaignResponse){
            $scope.campaignNee = campaignResponse.data;
            return AccountService.getUser($scope.campaignNee.brandId);
        })
        .then(function(brandUserDataResponse){
            $scope.brandUserInfo = brandUserDataResponse.data;
        })
        .catch(function(err){
            $scope.alert.danger(err.data.message);
        });


    }])
    .controller('InfluencerCampaignListController', ['$scope', '$state', 'CampaignService', 'ExampleCampaigns', '$rootScope',
        function ($scope, $state, CampaignService, ExampleCampaigns, $rootScope) {
            console.log('InfluencerCampaignListController');
            $scope.handleUserClickThumbnail = function(c){
                $state.go('influencer-campaign-detail-open', {
                    campaignId: c.campaignId
                });
            };
            $scope.filter = {
                mediaId: null
            };
            function fetch(filter) {
                CampaignService.getOpenCampaigns($scope.filter).then(function (data) {
                    console.log(data);
                    $scope.campaigns = data.data;
                });
            }

            $scope.$watch('filter', function (filterValue) {
                if (!filterValue || filterValue == "any") {
                    fetch();
                    return;
                }

                fetch({
                    mediaId: filterValue
                });
            });
        }])
    .controller('InfluencerProfileController', ['$scope', '$window', 'AccountService', 'NcAlert', 'UserProfile',
        function ($scope, $window, AccountService, NcAlert, UserProfile) {
            $scope.formData = {};
            $scope.alert = new NcAlert();
            $scope.saveProfile = function (profile) {
                AccountService.saveProfile(profile)
                    .then(function (response) {
                        // delete response.data.password;
                        // $scope.formData = response.data;
                        //set back to localstorage
                        UserProfile.set(response.data);

                        $scope.success = true;
                        $scope.alert.success('บันทึกข้อมูลเรียบร้อย!');
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });
            };

            AccountService.getProfile()
                .then(function (response) {
                    $scope.formData = response.data;
                    $scope.formData.influencer.categories = $scope.formData.influencer.categories || [];

                    _.forEach($scope.formData.influencer.categories, function(r) {
                      r._selected = true;
                    });
                    delete $scope.formData.password;
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });

        }]);

/////////////// /////////////// /////////////// /////////////// ///////////////
/*
d8888b. d8888b.  .d8b.  d8b   db d8888b.
88  `8D 88  `8D d8' `8b 888o  88 88  `8D
88oooY' 88oobY' 88ooo88 88V8o 88 88   88
88~~~b. 88`8b   88~~~88 88 V8o88 88   88
88   8D 88 `88. 88   88 88  V888 88  .8D
Y8888P' 88   YD YP   YP VP   V8P Y8888D'
*/
/////////////// /////////////// /////////////// /////////////// ///////////////


angular.module('myApp.brand.controller', ['myApp.service'])
    /*
    * Campaign List controller - thank god it's work.
    */
    .controller('CampaignListController', ['$scope', 'CampaignService', 'ExampleCampaigns', function ($scope, CampaignService, ExampleCampaigns) {
        $scope.testHit = function () {
            var scope = $scope;
            console.log("Test World");
        };
        $scope.myCampaign = [];

        CampaignService.getAll().then(function (response) {
            $scope.myCampaign = response.data;
        });

        //Example campaign section
        $scope.exampleCampaign = ExampleCampaigns;
    }])
    .controller('CampaignExampleController', ['$scope', '$stateParams', 'ExampleCampaigns', function ($scope, $stateParams, ExampleCampaigns) {
        $scope.exampleCampaign = ExampleCampaigns[$stateParams.exampleId];
    }])
    .controller('CampaignDetailController', ['$scope', '$stateParams', 'CampaignService', 'DataService', '$filter', 'UserProfile', 'NcAlert',
        function ($scope, $stateParams, CampaignService, DataService, $filter, UserProfile, NcAlert) {
            //initial form data

            $scope.alert = new NcAlert();

            $scope.resources = [];
            $scope.formData = {
                categoryId: {
                    categoryId: 0,
                    categoryName: "-- เลือกหมวดหมู่ --"
                },
                resources: []
            };

            $scope.mediaBooleanDict = {};
            $scope.mediaObjectDict = {};
            $scope.categories = [];
            $scope.budgets = [{
                id: 1,
                toBudget: 1000,
                fromBudget: 500
            }, {
                    id: 2,
                    toBudget: 5000,
                    fromBudget: 1000
                }, {
                    id: 3,
                    toBudget: 10000,
                    fromBudget: 5000
                }];

            $scope.budget = {
                id: 0,
                fromBudget: "-- เลือกค่าตอบแทน -",
                toBudget: ""
            };

            $scope.budgetDisplayAs = function (budgetObject) {
                return $filter('number')(budgetObject.fromBudget) + " - " + $filter('number')(budgetObject.toBudget);
            };

            //Fetch initial datasets
            DataService.getMedium()
                .then(function (response) {
                    $scope.medium = response.data;
                    $scope.medium.forEach(function (item) {
                        $scope.mediaObjectDict[item.mediaId] = item;
                    });
                });
            DataService.getCategories()
                .then(function (response) {
                    $scope.categories = response.data;
                    $scope.categories.unshift({
                        categoryId: 0,
                        categoryName: "-- เลือกหมวดหมู่ --"
                    });
                });

            $scope.$watch('mediaBooleanDict', function () {
                $scope.formData.media = [];
                //tell server which media are checked
                _.forEach($scope.mediaBooleanDict, function (value, key) {
                    if (value === true) {
                        $scope.formData.media.push($scope.mediaObjectDict[key]);
                    }
                });

            }, true);

            $scope.$watch('budget.id', function () {
                if($scope.budget){
                    $scope.formData.fromBudget = Number($scope.budget.fromBudget);
                    $scope.formData.toBudget = Number($scope.budget.toBudget);
                }
            });

            $scope.formData.brand = UserProfile.get().brand;

            //Setting up form
            var campaignId = $stateParams.campaignId;
            if (campaignId) {
                //If there is a campaign id in params
                //we are in edit mode
                CampaignService.getOne(campaignId)
                    .then(function (response) {
                        //overrides the form data
                        $scope.formData = angular.copy(response.data);
                        //Tell checkbox which media are in the array
                        ($scope.formData.media || []).forEach(function (item) {
                            $scope.mediaBooleanDict[item.mediaId] = true;
                        });
                        //Tell dropdown which budget is matching the budget object
                        $scope.budget = _.find($scope.budgets, function (probe) {
                            return Number(probe.fromBudget) === Number($scope.formData.fromBudget) &&
                                Number(probe.toBudget) === Number($scope.formData.toBudget);
                        });
                        //Split resources array into two parts
                        $scope.formData.resources = [];

                        if(response.data.resources && response.data.resources.length > 0){
                            $scope.formData.resources.push(response.data.resources.shift());
                            $scope.resources = angular.copy(response.data.resources); //the rest
                        }

                        console.log($scope.formData);

                        //ensure non null
                        $scope.formData.keywords = $scope.formData.keywords || [];

                        $scope.formData.brand = UserProfile.get().brand;
                        $scope.createMode = false;
                    });
            } else {
                $scope.createMode = true;
            }



            $scope.save = function (formData, mediaBooleanDict, mediaObjectDict, status) {
                $scope.formData.brand = UserProfile.get().brand;
                $scope.formData.status = status;
                $scope.formData.resources = $scope.formData.resources.concat($scope.resources || []);

                //check for publish case
                if (status == 'Open') {
                    if (!$scope.form.$valid) {
                        $scope.alert.danger('กรุณากรอกข้อมูลให้ถูกต้องให้ถูกต้องและครบถ้วน');
                        return;
                    }

                    if ($scope.resources.length < 1) {
                        $scope.alert.danger('กรุณากรอกข้อมูลให้ถูกต้องให้ถูกต้องและครบถ้วน');
                        return;
                    }
                }

                //saving
                CampaignService.save(formData)
                    .then(function (echoresponse) {
                        $scope.formData = echoresponse.data;

                        if (echoresponse.data.status == "Draft") {
                            $scope.alert.success('บันทึกข้อมูลเรียบร้อยแล้ว!');
                        } else if (echoresponse.data.status == 'Open') {
                            $scope.alert.success('ลงประกาศสำเร็จ! แต่ใจเย็นสิ ยังไม่ได้ทำ Flow นี้เฟร้ย!');
                        } else {
                            throw new Error("Weird status");
                        }
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });

            };

        }])
    .controller('BrandProfileController', ['$scope', '$window', 'AccountService', 'NcAlert', 'UserProfile', function ($scope, $window, AccountService, NcAlert, UserProfile) {
        $scope.formData = {};
        $scope.alert = new NcAlert();
        AccountService.getProfile()
            .then(function (response) {
                $scope.formData = response.data;
                delete $scope.formData.password;
            })
            .catch(function (err) {
                $scope.alert.danger(err.data.message);
            });

        $scope.saveProfile = function (form, profile) {
            AccountService.saveProfile(profile)
                .then(function (response) {
                    delete response.data.password;
                    $scope.formData = response.data;
                    //set back to localstorage
                    UserProfile.set(response.data);

                    $scope.success = true;
                    $scope.alert.success('บันทึกข้อมูลเรียบร้อย!');
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }]);


/////////////// /////////////// /////////////// /////////////// ///////////////
/*
8888888b.   .d88888b.  8888888b. 88888888888     d8888 888
888   Y88b d88P" "Y88b 888   Y88b    888        d88888 888
888    888 888     888 888    888    888       d88P888 888
888   d88P 888     888 888   d88P    888      d88P 888 888
8888888P"  888     888 8888888P"     888     d88P  888 888
888        888     888 888 T88b      888    d88P   888 888
888        Y88b. .d88P 888  T88b     888   d8888888888 888
888         "Y88888P"  888   T88b    888  d88P     888 88888888
*/
/////////////// /////////////// /////////////// /////////////// ///////////////

angular.module('myApp.portal.controller', ['myApp.service'])
    .controller('BrandSigninController', ['$scope', '$rootScope', '$location', 'AccountService', 'UserProfile', '$window', 'NcAlert', function ($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
        $scope.formData = {};
        $window.localStorage.removeItem('token');
        $scope.messageCode = $location.search().message;
        $scope.alert = new NcAlert();

        if ($scope.messageCode == "401") {
            $scope.alert.warning("<strong>401</strong> Unauthorized or Session Expired");
        }

        $scope.login = function (username, password) {
            $location.search('message', 'nop');
            AccountService.getToken(username, password)
                .then(function (response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    $window.localStorage.profile = JSON.stringify(profileResp.data);
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());
                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal.html#/brand-login");
                    $window.location.href = '/brand.html#/brand-campaign-list';
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('InfluencerPortalController', ['$scope', '$rootScope', 'NcAlert', '$auth', '$state', '$stateParams', 'AccountService', 'UserProfile', '$window',  'BusinessConfig', 
    function ($scope, $rootScope, NcAlert, $auth, $state, $stateParams, AccountService, UserProfile, $window, BusinessConfig) {
        $scope.alert = new NcAlert();
        $scope.minFollower = BusinessConfig.MIN_FOLLOWER_COUNT;

        if($stateParams.alert){
            $scope.alert[$stateParams.alert.type]($stateParams.alert.message);
        }

        $scope.startAuthFlow = function (mediaId) {
            $window.localStorage.clear();
            $auth.authenticate(mediaId)
                .then(function (response) {
                    console.log('Response', response.data);
                    if (response.data.token) {
                        $rootScope.setUnauthorizedRoute("/portal.html#/influencer-portal");

                        $window.localStorage.token = response.data.token;
                        AccountService.getProfile()
                            .then(function (profileResp) {
                                UserProfile.set(profileResp.data);
                                //Tell raven about the user
                                Raven.setUserContext(UserProfile.get());
                                //Redirect change app
                                $window.location.href = '/influencer.html#/influencer-campaign-list';
                            });
                    } else {
                        console.log(response.data);
                        if (mediaId == 'facebook') {
                            $state.go('influencer-signup-select-page', { authData: response.data });
                        } else {
                            $state.go('influencer-signup-confirmation', { authData: response.data });
                        }
                    }



                });
        };

    }])
    .controller('InfluencerFacebookPageSelectionController', ['$scope', 'NcAlert', '$auth', '$state', '$stateParams', 'InfluencerAccountService', 'BusinessConfig', function ($scope, NcAlert, $auth, $state, $stateParams, InfluencerAccountService, BusinessConfig) {
        var authData = $stateParams.authData;
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
            if($stateParams.fromState){
                return $state.go($stateParams.fromState, {
                    authData: authobject
                });
            }

            $state.go('influencer-signup-confirmation', {
                //reduce the pages array to just one array of page
                //that you selected
                authData: authobject
            });
        };
    }])
    .controller('InfluencerSignUpController', 
    ['$scope', '$rootScope', 'NcAlert', '$auth', '$state', '$stateParams', 'InfluencerAccountService', 'AccountService', 'UserProfile', '$window','ResourceService', 'BusinessConfig',
        function ($scope, $rootScope, NcAlert, $auth, $state, $stateParams, InfluencerAccountService, AccountService, UserProfile, $window, ResourceService, BusinessConfig) {

            var profile = $stateParams.authData;
            $scope.alert = new NcAlert();
            
            //TODO : get value from provider somewhere or smth
            $scope.minFollower = BusinessConfig.MIN_FOLLOWER_COUNT;

            $scope.formData = profile;
            if (!profile) {
                $state.go('influencer-portal');
                return;
            }
            if($scope.formData.pages[0].count < Number($scope.minFollower)){
                //not meet requirement
                $state.go('influencer-portal', { alert: { type: 'danger', message: 'คุณต้องมีผู้ติดตามอย่างน้อย ' + $scope.minFollower + ' คนเพื่อสมัคร' } } );
                return;
            }

            //Upload remote profile picture to get reosurce object
            ResourceService.uploadWithUrl(profile.profilePicture)
            .then(function(resource){
                $scope.profilePictureResource = resource.data;
            });

            
            
            $scope.register = function () {
                InfluencerAccountService.signup({
                    name: $scope.formData.name,
                    email: $scope.formData.email,
                    phoneNumber: $scope.formData.phoneNumber,
                    influencer: {
                        influencerMedias: [{
                            media: $scope.formData.media,
                            socialId: $scope.formData.id,
                            pageId: $scope.formData.pageId || null
                        }]
                    },
                    profilePicture: $scope.profilePictureResource
                })
                .then(function (response) {
                        var token = response.data.token;
                        $window.localStorage.token = token;
                        return AccountService.getProfile();
                    })
                    .then(function (profileResp) {
                        $rootScope.setUnauthorizedRoute("/portal.html#/influencer-portal");
                        UserProfile.set(profileResp.data);
                        //Tell raven about the user
                        Raven.setUserContext(UserProfile.get());
                        //Redirect change app
                        $window.location.href = '/influencer.html#/influencer-campaign-list';
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });
            };
        }])
    .controller('BrandSignupController', ['$scope', '$rootScope', 'BrandAccountService', 'AccountService', 'UserProfile', '$location', '$window', 'NcAlert',
        function ($scope, $rootScope, BrandAccountService, AccountService, UserProfile, $location, $window, NcAlert) {

            $scope.formData = {};

            $scope.alert = new NcAlert();

            $scope.submit = function (brand) {
                if (!$scope.form.$valid) {
                    $scope.alert.danger('กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน');
                    return;
                }
                $window.localStorage.clear();
                BrandAccountService.signup(brand)
                    .then(function (response) {
                        var token = response.data.token;
                        $window.localStorage.token = token;
                        return AccountService.getProfile();
                    })
                    .then(function (profileResp) {
                        UserProfile.set(profileResp.data);
                        //Tell raven about the user
                        Raven.setUserContext(UserProfile.get());
                        //Redirect
                        $rootScope.setUnauthorizedRoute("/portal.html#/brand-login");
                        $window.location.href = '/brand.html#/brand-campaign-list';
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });
            };

        }]);
