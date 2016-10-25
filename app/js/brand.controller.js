require('./common.service');

angular.module('reachRabbitApp.brand.controller', ['reachRabbitApp.common.service'])
    .controller('CampaignListController', function ($scope, CampaignService, DataService, ExampleCampaigns) {
        $scope.myCampaign = [];
        $scope.filters = [
            {
                status: undefined,
                name: 'แสดง Campaign ทั้งหมด'
            },
            {
                status: 'Draft',
                name: 'เฉพาะ ฉบับร่าง'
            },
            {
                status: 'Open',
                name: 'เฉพาะ เปิดรับข้อเสนอ'
            },
            {
                status: 'Close',
                name: 'เฉพาะ ปิดรับข้อเสนอ'
            }];

        $scope.$watch('params.search', function () {
            $scope.load($scope.params);
        });

        //Load campaign data
        $scope.load = function (data) {
            $scope.params = data;
            CampaignService.getAll(data).then(function (response) {
                $scope.myCampaign = response.data;
            });
        };
        //Init
        $scope.load({ sort: 'updatedAt,desc' });

        //Example campaign section
        $scope.exampleCampaign = ExampleCampaigns;
    })
    .controller('CampaignExampleController', function ($scope, $stateParams, ExampleCampaigns) {
        $scope.exampleCampaign = ExampleCampaigns[$stateParams.exampleId];
    })
    .controller('CampaignDetailController', function ($scope, $rootScope, $stateParams, CampaignService, DataService, $filter, UserProfile, $uibModal, NcAlert, validator, $state, util) {
            //initial form data
            $scope.alert = new NcAlert();
            $scope.editOpenState = $stateParams.editOpenState;
            if ($stateParams.alert) {
                $scope.alert.success($stateParams.alert);
            }
            $scope.form = {};
            util.warnOnExit($scope);

            $scope.resources = [];
            $scope.formData = {
                mainResource: null,
                campaignResources: [],
                budget: null
            };

            $scope.remove = function () {
                $uibModal.open({
                    templateUrl: 'components/templates/campaign-delete-confirmation-modal.html',
                    size: 'sm'
                }).result.then(function () {
                    CampaignService.delete($scope.campaignNee.campaignId)
                        .then(function () {
                            $state.go('brand-campaign-list');
                        })
                        .catch(function (err) {
                            $scope.alert.danger(err.data.message);
                        });
                });
            };

            $scope.campaignNee = $scope.formData;

            $scope.mediaBooleanDict = {};
            $scope.mediaObjectDict = {};
            $scope.categories = [];
            $scope.budgets = [];

            DataService.getBudgets().then(function (resp) {
                $scope.budgets = resp.data;
            });

            $scope.dateOptions = _.extend({}, $rootScope.dateOptions, {
                minDate: new Date(),
                customClass: function (object) {
                    if (object.date.getTime() < (new Date()).getTime()) {
                        return ["nc-dt-button", "nc-dt-disable"];
                    }

                    return "nc-dt-button";
                }
            });

            $scope.budgetDisplayAs = function (budgetObject) {
                return $filter('number')(budgetObject.fromBudget) + " - " + $filter('number')(budgetObject.toBudget) + " บาท ต่อคน";
            };

            var mediaBooleanDictProcess = function (formData) {
                formData.media = [];
                //tell server which media are checked
                _.forEach($scope.mediaBooleanDict, function (value, key) {
                    if (value === true) {
                        formData.media.push($scope.mediaObjectDict[key]);
                    }
                });
            };

            //Fetch initial datasets
            DataService.getWorkTypes()
            .then(function(g){
                $scope.workTypes = g.data;
            });
            DataService.getMedium()
                .then(function (response) {
                    $scope.medium = response.data;
                    $scope.medium.forEach(function (item) {
                        $scope.mediaObjectDict[item.mediaId] = item;
                        $scope.$watch('mediaBooleanDict', function () {
                            mediaBooleanDictProcess($scope.formData);
                        }, true);
                    });
                });

            DataService.getCategories()
                .then(function (response) {
                    $scope.categories = response.data;
                });




            $scope.formData.brand = UserProfile.get().brand;

            function getOne(cid) {
                CampaignService.getOne(cid)
                    .then(function (response) {
                        //overrides the form data
                        $scope.formData = angular.copy(response.data);
                        $scope.mediaBooleanDict = {};
                        //Tell checkbox which media are in the array
                        ($scope.formData.media || []).forEach(function (item) {
                            $scope.mediaBooleanDict[item.mediaId] = true;
                        });

                        $scope.campaignNee = $scope.formData;

                        //if is published
                        if ($scope.formData.status === "Open" && !$stateParams.editOpenState) {
                            $state.go('brand-campaign-detail-published', { campaignId: $scope.campaignNee.campaignId });
                        }

                        //ensure non null
                        $scope.formData.keywords = $scope.formData.keywords || [];


                        $scope.formData.objectiveArray = [];
                        if($scope.formData.objective){
                             $scope.formData.objectiveArray.push($scope.formData.objective);
                        }

                        if (!$scope.formData.brand) {
                            $scope.formData.brand = UserProfile.get().brand;
                        }

                        if (!$scope.formData.rabbitFlag && $scope.formData.status === 'Open' && !$stateParams.editOpenState && !document.querySelector(".message-modal")) {

                            var modalInstance = $uibModal.open({
                                animation: false,
                                templateUrl: 'components/templates/brand-publish-campaign-modal.html',
                                controller: 'CampaignMessageModalController',
                                size: 'sm',
                                windowClass: 'message-modal',
                                backdrop: 'static',
                                resolve: {
                                    email: function () {
                                        return UserProfile.get().email;
                                    },
                                    campaignId: function () {
                                        return $scope.formData.campaignId;
                                    }
                                }
                            });
                        }

                        $scope.createMode = false;
                    });
            }

            //Setting up form
            var campaignId = $stateParams.campaignId;
            if (campaignId) {
                //If there is a campaign id in params
                //we are in edit mode
                getOne(campaignId);
            } else {
                $scope.createMode = true;
            }
            var today = moment();

            $scope.isRecommendedDate = function () {
                if ($scope.formData && $scope.formData.proposalDeadline && moment($scope.formData.proposalDeadline).subtract(13, 'day').isBefore(today)) {
                    return true;
                }
            };

            $scope.isInvalidMedia = function () {
                if(!$scope.formData.media) {
                    return false;
                }
                return $scope.formData.media.length === 0 && $scope.form.$submitted && $scope.formData.status == 'Open';
            };
            $scope.isPublishing = function (model, key) {
                //Only validate publish for resource
                if (model && model.$name === 'resource' && key !== 'required') {
                    return true;
                }
                return $scope.formData.status === 'Open';
            };

            $scope.$watch('formData.objectiveArray+formData.productName', function(t){
                $scope.formData.title = $scope.formData.productName;
                if($scope.formData.objectiveArray && $scope.formData.objectiveArray.length > 0){
                    $scope.formData.title = $scope.formData.objectiveArray[0].objectiveName.replace("สินค้า", "") + ' ' + $scope.formData.productName;
                }

            });

            $scope.save = function (formData, mediaBooleanDict, mediaObjectDict, status) {
                formData.brand = UserProfile.get().brand;
                formData.status = status;

                if(formData.objectiveArray.length > 0){
                    formData.objective = formData.objectiveArray[0];
                }else{
                    formData.objective = null;
                }
                formData.workTypeMap = formData.workTypeMap || {};


                if (formData.website && formData.website.length > 1 && !formData.website.startsWith("http")) {
                    formData.website = "http://" + formData.website;
                }

                mediaBooleanDictProcess(formData);

                // $scope.formData.resources = $scope.formData.resources.concat($scope.resources || []);

                //check for publish case
                if (status == 'Open') {
                    var o = validator.formValidate($scope.form);
                    if (o || formData.media.length === 0) {
                        $scope.form.$setSubmitted();
                        $scope.alert.danger(o.message);
                        return;
                    }
                }

                //saving
                CampaignService.save(formData)
                    .then(function (echoresponse) {
                        $scope.form.$setPristine();
                        if (formData.status === "Open") {
                            $state.go('brand-campaign-detail-published', { campaignId: echoresponse.data.campaignId, alert: "บันทึกข้อมูล และ ลงประกาศเรียบร้อยแล้ว" });
                        } else if (status == "Draft" && echoresponse.data.status == "Draft") {
                            getOne(echoresponse.data.campaignId);
                            $scope.alert.success('บันทึกข้อมูลเรียบร้อยแล้ว!');
                        }
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });

            };

        }
    )
    .controller('CampaignDashboardController', function ($scope, $rootScope, $stateParams, CampaignService, DataService, $filter, UserProfile, $uibModal, NcAlert, validator, $state, util) {
            //initial form data
            $scope.alert = new NcAlert();
            $scope.editOpenState = $stateParams.editOpenState;
            $scope.form = {};
            util.warnOnExit($scope);

            $scope.resources = [];
            $scope.formData = {
                mainResource: null,
                campaignResources: [],
                budget: null
            };
            $scope.campaignNee = $scope.formData;

            $scope.mediaBooleanDict = {};
            $scope.mediaObjectDict = {};
            $scope.categories = [];
            $scope.budgets = [];

            DataService.getBudgets().then(function (resp) {
                $scope.budgets = resp.data;
            });

            $scope.dateOptions = _.extend({}, $rootScope.dateOptions, {
                minDate: new Date(),
                customClass: function (object) {
                    if (object.date.getTime() < (new Date()).getTime()) {
                        return ["nc-dt-button", "nc-dt-disable"];
                    }

                    return "nc-dt-button";
                }
            });
            //Setting up form
            var campaignId = $stateParams.campaignId;

            $scope.budgetDisplayAs = function (budgetObject) {
                return $filter('number')(budgetObject.fromBudget) + " - " + $filter('number')(budgetObject.toBudget) + " บาท ต่อคน";
            };

            //Fetch initial datasets
            DataService.getMedium()
                .then(function (response) {
                    $scope.medium = response.data;
                    $scope.medium.forEach(function (item) {
                        $scope.mediaObjectDict[item.mediaId] = item;
                    });
                })
                .then(function() {
                  return getOne(campaignId);
                });
            DataService.getCategories()
                .then(function (response) {
                    $scope.categories = response.data;
                });

            var mediaBooleanDictProcess = function (formData) {
                formData.media = [];
                //tell server which media are checked
                _.forEach($scope.mediaBooleanDict, function (value, key) {
                    if (value === true) {
                        formData.media.push($scope.mediaObjectDict[key]);
                    }
                });
            };
            $scope.$watch('mediaBooleanDict', function () {
                mediaBooleanDictProcess($scope.formData);
            }, true);

            $scope.openCampaign = function() {
                $state.go('brand-campaign-detail-draft',{
                    campaignId: $scope.campaignNee.campaignId
                });
            };
            // get follower for this influencer
            function getFollower(data, mediaId) {
              var counter = 0;
              _.forEach(data.influencerMedias, function(e) {
                if(!mediaId || e.media.mediaId === mediaId) {
                  counter += e.followerCount;
                }
              });
              return counter;
            }
            function getDataByMedia(data, mediaId) {
              var obj = {};
              obj.influencers = []; // by influencer
              obj.dataset = [];

              var posts = []; // all posts
              var keys = null;
              var postKeys = null;
              var summator = function(sum, n) {
                // ignore wrong media
                if(n.mediaId !== mediaId) {
                  return sum;
                }
                // get key list for sum

                keys = keys ? keys : _.keys(_.pickBy(n, function(value, key) {
                  return _.startsWith(key, "sum");
                }));
                // sum each keys
                _.forEach(keys, function(k) {
                  sum[k] = (sum[k] || 0) + n[k];
                  if(mediaId === 'google' && k === 'sumView') {
                    // no need to add
                  } else {
                    sum.sumEngagement = (sum.sumEngagement || 0) + n[k];
                  }
                });

                postKeys = postKeys ? postKeys : _.keys(_.pickBy(sum, function(value, key) {
                  return _.startsWith(key, "sum");
                }));
                // accumulate
                return sum;
              };
              var createDailyFields = function(datasetArray, datasetArrayNext) {
                if(!datasetArrayNext) {
                  return function(key) {
                    var newKey = key.replace('sum', 'daily');
                    datasetArray[newKey] = (datasetArray[key] || 0);
                  };
                }
                return function(key) {
                  var newKey = key.replace('sum', 'daily');
                  datasetArrayNext[newKey] = (datasetArrayNext[key] || 0) - (datasetArray[key] || 0);
                };
              };

              // get only post with mediaId
              _.forEach(data, function(p) {
                var has = false;
                var hasPosts = false;

                // get all posts data
                _.forEach(p.posts, function(e) {
                  if(e.mediaId === mediaId) {
                    posts.push(e);
                    hasPosts = true;
                  }
                });
                _.forEach(p.media, function(e) {
                  if(e.mediaId === mediaId) {
                    has = true;
                  }
                });

                if(!has && !hasPosts) {
                  return;
                }
                // build influencer data
                var influencer = {};

                // get per-influencer data
                influencer.hasPosts = hasPosts;
                _.extend(influencer, p.influencer);
                if(influencer.hasPosts) {
                    var tmp = _.groupBy(p.posts, 'date');
                    var keys = _.reverse(_.sortBy(_.keys(tmp), function(o) {
                        return moment(o.date).toDate();
                    }));
                    var latestPosts = keys.length > 0 ? tmp[keys[0]] : [];
                    _.extend(influencer, _.reduce(latestPosts, summator , {}));
                    influencer.sumFollowerCount = getFollower(p.influencer, mediaId);
                    influencer.sumEngagementRate = influencer.sumFollowerCount > 0 ? Math.round((influencer.sumEngagement / parseFloat(influencer.sumFollowerCount)) * 10000) / 100.0 : null;
                }
                obj.influencers.push(influencer);
              });

              // build per-media

              // dataset by time
              var dataset = _.groupBy(posts, 'date');
              var datasetArray = [];
              _.forOwn(dataset, function(v,k) {
                //sum all data up for this timeframe
                var d = _.reduce(dataset[k], summator, {});
                d.date = k;
                datasetArray.push(d);
              });

              datasetArray = _.sortBy(datasetArray, function(o) {
                  return moment(o.date).toDate();
              });

              // create daily-fields
              for(var i = 0; i < datasetArray.length - 1; i++) {
                if(i === 0) {
                  _.forEach(postKeys, createDailyFields(datasetArray[i]));
                }
                _.forEach(postKeys, createDailyFields(datasetArray[i], datasetArray[i+1]));

              }

              // fill in per-media data
              obj.dataset = datasetArray;
              obj.sumFollowerCount = _.reduce(obj.influencers, function(sum, n) {
                return sum + n.sumFollowerCount;
              }, 0);
              obj.sumInfluencer = obj.influencers.length;

              // totalsum
              _.extend(obj, datasetArray[datasetArray.length - 1]);

              return obj;
            }
            function getData(data) {
              var obj = {};
              // global data
              obj.sumInfluencer = data.length;
              obj.sumPrice = _.reduce(data, function(sum, n) {
                return sum + (n.price || 0);
              }, 0);
              obj.sumFollowerCount = _.reduce(data, function(sum, n) {
                return sum + getFollower(n.influencer);
              }, 0);

              // per-media data
              obj.media = {};
              var sumEngagement = 0;
              _.forOwn($scope.mediaObjectDict, function(v,k) {
                obj.media[k] = getDataByMedia(data, k);
                sumEngagement += obj.media[k].sumEngagement || 0;
              });

              obj.sumCPE = (sumEngagement === 0) ? 0 : Math.round((obj.sumPrice / parseFloat(sumEngagement)) * 1000) / 1000.0;

              return obj;
            }
            function getOne(cid) {
                CampaignService.getOne(cid)
                    .then(function (response) {
                        //overrides the form data
                        $scope.formData = angular.copy(response.data);
                        $scope.mediaBooleanDict = {};
                        //Tell checkbox which media are in the array
                        ($scope.formData.media || []).forEach(function (item) {
                            $scope.mediaBooleanDict[item.mediaId] = true;
                        });

                        $scope.campaignNee = $scope.formData;
                        //ensure non null
                        $scope.formData.keywords = $scope.formData.keywords || [];
                    });
                CampaignService.getProposals(cid)
                  .then(function(res) {
                    $scope.dashboard = getData(res.data);
                    console.log($scope.dashboard, res.data);
                  });
            }
        }
    )
    .controller('BrandProfileController', function ($scope, $window, AccountService, NcAlert, UserProfile, validator, util) {
        $scope.formData = {};
        $scope.profile = {};
        $scope.form = {};
        $scope.alert = new NcAlert();
        util.warnOnExit($scope);

        $scope.setShowPassword = function () {
            $scope.showPassword = true;
        };

        $scope.showPassword = false;

        AccountService.getProfile()
            .then(function (response) {
                $scope.formData = response.data;
                if($scope.formData.brand.isCompany) {
                  $scope.alreadyCompany = true;
                }
            })
            .catch(function (err) {
                $scope.alert.danger(err.data.message);
            });

        $scope.isValidate = function (model, error) {
            if (error === 'required' && model.$name === 'profilePicture') {
                return $scope.form.$submitted;
            }
            return true;
        };
        $scope.saveProfile = function (form, profile) {
            $scope.form.$setSubmitted();
            if (!$scope.form.$valid) {
                var o = validator.formValidate($scope.form);
                $scope.alert.danger(o.message);
                return;
            }

            if (profile.brand.website && profile.brand.website.length > 1 && !profile.brand.website.startsWith("http")) {
                profile.brand.website = "http://" + profile.brand.website;
            }

            AccountService.saveProfile(profile)
                .then(function (response) {
                    delete response.data.password;
                    $scope.formData = response.data;
                    if($scope.formData.brand.isCompany) {
                      $scope.alreadyCompany = true;
                    }

                    //set back to localstorage
                    UserProfile.set(response.data);


                    $scope.form.$setPristine();
                    $scope.success = true;
                    $scope.alert.success('บันทึกข้อมูลเรียบร้อย!');
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    })
    .controller('BrandInboxController', function ($scope, $filter, $rootScope, ProposalService, CampaignService, moment, $stateParams) {
        $scope.statusCounts = {};
        $scope.statusFilter = 'Selection';
        $scope.search = {};

        if ($stateParams.status) {
            $scope.statusFilter = $stateParams.status;
        }

        $scope.calculateReach = function (proposal) {
            var mediaList = _.intersectionBy((proposal.influencer.influencerMedias || []).map(function (mi) {
                mi.mediaId = mi.media.mediaId;
                return mi;
            }), proposal.media, 'mediaId');
            return $rootScope.sumReduce(mediaList, 'followerCount');
        };

        //TODO: Make this generic

        $scope.load = function (params, ext) {
            $scope.httpPending = true;
            $scope.params = _.extend(params, ext);
            $scope.params.status = $scope.statusFilter;

            return ProposalService.getAll(params)
                .then(function (response) {
                    $scope.proposals = response.data;
                    _.forEach($scope.proposals.content, function (proposal) {
                        ProposalService.countUnreadMessages(proposal.proposalId)
                            .then(function (res) {
                                proposal.unread = res.data;
                            });
                    });
                });
        };
        $scope.loadProposalCounts = function () {
            $scope.httpPending = true;
            //Selection status
            return ProposalService.count({
                status: 'Selection'
            })
                .then(function (res) {
                    $scope.statusCounts.selection = res.data;
                    //Working status
                    return ProposalService.count({
                        status: 'Working'
                    });
                })
                .then(function (res) {
                    $scope.statusCounts.working = res.data;
                    //Complete status
                    return ProposalService.count({
                        status: 'Complete'
                    });
                })
                .then(function (res) {
                    $scope.statusCounts.complete = res.data;
                });
        };
        $scope.lastMessageUpdated = function (proposal) {
            if (moment(proposal.messageUpdatedAt).isBefore(moment().endOf('day').subtract(1, 'days'))) {
                return $filter('amDateFormat')(proposal.messageUpdatedAt, 'll');
            }
            return $filter('amCalendar')(proposal.messageUpdatedAt);
        };

        $scope.$watch('search.value', function(e) {
            $scope.load($scope.params, { search: e });
        });

        $scope.load({
            sort: ['messageUpdatedAt,desc']
        })
            .then(function () {
                return $scope.loadProposalCounts();
            })
            .then(function () {
                $scope.httpPending = false;
            });

    })
    .controller('CartController', function ($scope, $rootScope, $state, NcAlert, BrandAccountService, ProposalService, TransactionService, $stateParams, UserProfile, BusinessConfig) {
        $scope.alert = new NcAlert();
        $scope.user = UserProfile.get();
        var loadCart = function () {
            BrandAccountService.getCart().then(function (cart) {
                $scope.cart = cart.data;
            });
        };
        $scope.checkout = function (CartArray) {
            console.log(CartArray);
        };
        $scope.totalPrice = function (CartArray) {
            if (!CartArray) return 0;
            return CartArray.reduce(function (p, c) {
                return p + c.price;
            }, 0);
        };
        $scope.totalTax = function(CartArray) {
            if (!CartArray || !$scope.user.brand.isCompany) return 0;
            var price = $scope.totalPrice(CartArray);
            return price * BusinessConfig.BRAND_TAX_FEE;
        };
        $scope.totalPriceWithTax = function(CartArray) {
            if (!CartArray) return 0;
            return $scope.totalPrice(CartArray) - $scope.totalTax(CartArray);
        };
        $scope.removeFromCart = function (p) {
            ProposalService.removeFromCart(p)
                .then(function () {
                    loadCart();
                    //refresh rootscope counter
                    $rootScope.cartCount = Number($rootScope.cartCount) - 1;
                });
        };
        $scope.createTransaction = function () {
            return TransactionService.create().then(function (transaction) {
                $state.go("brand-transaction-detail", { cartId: $scope.cart.cartId });
            })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
        loadCart();
    })
    .controller('TransactionHistoryController', function ($scope, NcAlert, $state, $stateParams, TransactionService) {
        //Load campaign data
        $scope.load = function (data) {
            data.type = 'Payin';
            $scope.params = data;
            TransactionService.getAll(data).then(function (response) {
                $scope.transactions = response.data;
            });
        };
        $scope.load({
            sort: 'updatedAt,desc'
        });
    })
    .controller('TransactionController', function ($scope, NcAlert, $stateParams, TransactionService) {
        var cartId = $stateParams.cartId;
        TransactionService.getByCart(cartId)
            .then(function (transaction) {
                $scope.transaction = transaction.data;
            });

        $scope.isExpired = function () {
            if (!$scope.transaction) {
                return false;
            }
            return $scope.transaction.expiredAt.getTime() <= (new Date()).getTime();
        };

        $scope.timeLeft = function () {
            if (!$scope.transaction) {
                return;
            }

            var tleft = (new Date()).getTime() - $scope.transaction.expiredAt.getTime();
            var tleftAbs = Math.abs(tleft);
            var Decimal = tleftAbs / (1000 * 3600 * 24);
            var HourDecimal = (Decimal % 1) * 24;
            var DAY = Math.floor(Decimal);
            var HOUR = Math.floor(HourDecimal);
            var MINUTE = Math.floor((HourDecimal % 1) * 60);

            return [DAY, HOUR, MINUTE];
        };

    });