require('./common.service');

angular.module('reachRabbitApp.admin.controller', ['reachRabbitApp.common.service'])
    .controller('AdminReferralCodeListController', function($scope, ReferralService, NcAlert) {
        $scope.alert = new NcAlert();
        $scope.search = {};
        $scope.$watch('search.value', function(e) {
            $scope.load($scope.params, { search: e });
        });
        $scope.load = function (data, ext) {
            $scope.params = _.extend(data, ext);
            ReferralService.getAll(data)
                .then(function (response) {
                    $scope.referrals = response.data;
                });
        };
        $scope.save = function() {
            ReferralService.create($scope.formData)
                .then(function(res) {
                    $scope.formData = {};
                    $scope.load($scope.params);
                    $scope.alert.success('บันทึกข้อมูลสำเร็จเรียบร้อย');
                })
                .catch(function(e) {
                    $scope.alert.danger(e.data.message);
                });
        };
        //Init
        $scope.load({
            sort: 'createdAt,desc'
        });
    })
    .controller('AdminReferralPaymentListController', function($scope, ReferralService, NcAlert, $uibModal) {
        $scope.alert = new NcAlert();
        $scope.search = {};
        $scope.$watch('search.value', function(e) {
            $scope.load($scope.params, { search: e });
        });
        $scope.load = function (data, ext) {
            $scope.params = _.extend(data, ext);
            ReferralService.getAllPayments(data)
                .then(function (response) {
                    $scope.referrals = response.data;
                });
        };
        $scope.save = function(row) {
            //TODO
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'components/templates/referral-payment-confirmation-modal.html',
                size: 'sm'
            });
            modalInstance.result.then(function() {
                ReferralService.postReferral(row.proposalId)
                    .then(function() {
                        $scope.load($scope.params);
                    });
            });
        };
        //Init
        $scope.load({
            sort: 'createdAt,desc'
        });
    })
    .controller('AdminUserDetailController', function($scope, AccountService, $stateParams, NcAlert) {
        $scope.alert = new NcAlert();
        $scope.hasMedia = function (mediaId) {
            for (var i = 0; i < _.get($scope.formData, 'influencer.influencerMedias', []).length; i++) {
                if ($scope.formData.influencer.influencerMedias[i].media.mediaId == mediaId) {
                    return true;
                }
            }
            return false;
        };
        // fetch profile
        AccountService.getProfile($stateParams.userId)
            .then(function (response) {
                $scope.formData = response.data;

                if($scope.formData.influencer) {

                    $scope.formData.influencer.categories = $scope.formData.influencer.categories || [];
                    $scope.formData.influencer.user = $scope.formData;

                    // fetch each media
                    if ($scope.hasMedia('google')) {
                        AccountService.getYouTubeProfile($stateParams.userId)
                            .then(function (response) {
                                $scope.youtube = response.data;
                            });
                    }
                    if ($scope.hasMedia('facebook')) {
                        AccountService.getFacebookProfile($stateParams.userId)
                            .then(function (response) {
                                $scope.facebook = response.data;
                            });
                    }
                    if ($scope.hasMedia('instagram')) {
                        AccountService.getInstagramProfile($stateParams.userId)
                            .then(function (response) {
                                $scope.instagram = response.data;
                            });
                    }

                    // assign categories
                    _.forEach($scope.formData.influencer.categories, function (r) {
                        r._selected = true;
                    });
                }
            })
            .catch(function (err) {
                $scope.alert.danger(err.data.message);
            });
    })
    .controller('AdminInfluencerListController', function($rootScope,$scope, $location, AccountService, $window, UserProfile, NcAlert) {        
        $scope.loginAs = function(item) {
            AccountService.loginAs(item.userId)
                .then(function (response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    $window.localStorage.profile = JSON.stringify(profileResp.data);
                    //Tell raven about the user
                    //Raven.setUserContext(UserProfile.get());
                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal#/influencer-login");
                    var bounce = '/influencer#/influencer-campaign-list';
                    if ($location.search().bounce_route) {
                        bounce = '/influencer#' + $location.search().bounce_route;
                    }
                    $window.location.href = bounce;
                })
                .catch(function(e) {
                    console.log(e);
                });
        };
        $scope.alert = new NcAlert();
        $scope.updateCommission = function (user){
            AccountService.saveCommission(user.userId,user.influencer.commission)
                .then( function(response) {
                $scope.alert.success('บันทึกสําเร็จ');
            });
        };
        //Load campaign data
        $scope.load = function (data) {
            $scope.params = data;
            AccountService.getAllInfluencer(data)
                .then(function (response) {
                    $scope.users = response.data;
                });
        };
        //Init
        $scope.load({
            sort: 'updatedAt,desc'
        });
    })
    .controller('AdminBrandListController', function($rootScope, $scope, $location, AccountService, $window, UserProfile) {
        $scope.loginAs = function(item) {
            AccountService.loginAs(item.userId)
                .then(function(res) {
                    var token = res.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function (profileResp) {
                    UserProfile.set(profileResp.data);
                    //Tell raven about the user
                    //Raven.setUserContext(UserProfile.get());

                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal#/brand-login");
                    var bounce = '/brand#/brand-campaign-list';
                    if ($location.search().bounce_route) {
                        bounce = ('/brand#' + $location.search().bounce_route);
                    }
                    $window.location.href = bounce;

                })
                .catch(function(e) {
                    console.log(e);
                });
        };
        //Load campaign data
        $scope.load = function (data) {
            $scope.params = data;
            AccountService.getAllBrand(data)
                .then(function (response) {
                    $scope.users = response.data;
                });
        };
        //Init
        $scope.load({
            sort: 'updatedAt,desc'
        });
    })
    .controller('AdminTransactionHistoryController', function ($scope, $state, TransactionService) {
        //Load campaign data
        $scope.isExpired = function (T) {
            return T.expiredAt <= (new Date());
        };
        $scope.load = function (data) {
            $scope.params = data;
            TransactionService.getAll(_.extend(data, { type: 'Payin' })).then(function (response) {
                $scope.transactions = response.data;
            });
        };
        $scope.load({
            sort: 'updatedAt,desc'
        });
    })
    .controller('AdminCampaignDetailController', function ($scope, $state, $location, $stateParams, CampaignService, NcAlert, AccountService) {
            $scope.campaignNee = null;
            $scope.alert = new NcAlert();
            $scope.url = null;

            $scope.keywordMap = function (arr) {
                if (!arr) return [];
                return arr.map(function (k) {
                    return k.keyword;
                });
            };

            $scope.changeToDraft = function () {
                CampaignService.save(_.extend({}, $scope.campaignNee, { status: 'Draft' })).then(function (response) {
                    _.extend($scope.campaignNee, response.data);
                });
            };

            CampaignService.getOne($stateParams.campaignId)
                .then(function (campaignResponse) {
                    $scope.campaignNee = campaignResponse.data;
                    $scope.url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/public#/public-campaign-detail/' + $scope.campaignNee.publicCode;
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        }
    )
    .controller('AdminCampaignListController', function ($scope, CampaignService) {

        //Load campaign data
        $scope.load = function (data) {
            $scope.params = data;
            CampaignService.getAll(data).then(function (response) {
                $scope.campaigns = response.data;
            });
        };
        //Init
        $scope.load({
            sort: 'updatedAt,desc'
        });
    })
    .controller('AdminInboxController', function ($scope, $filter, $rootScope, ProposalService, CampaignService, moment, $stateParams) {
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
    .controller('AdminPayoutHistoryController', function ($scope, $state, TransactionService) {
        //Load campaign data
        $scope.isExpired = function (T) {
            return T.expiredAt <= (new Date());
        };
        $scope.load = function (data) {
            $scope.params = data;
            TransactionService.getAll(_.extend(data, { type: 'Payout' })).then(function (response) {
                $scope.transactions = response.data;
            });
        };
        $scope.load({
            sort: 'updatedAt,desc'
        });
    })
    .controller('AdminWorkroomController', function ($scope, UserProfile, $uibModal, $interval, $rootScope, $stateParams, ProposalService, NcAlert, $state, $location, $window, util, LongPollingService, $timeout, InfluencerAccountService) {
            $scope.msglist = [];
            $scope.msgHash = {};
            $scope.links = {
                facebook: [],
                instagram: [],
                google: []
            };
            $scope.msgLimit = 30;
            $scope.totalElements = 0;

            $scope.alert = new NcAlert();

            $scope.hasInWallet = function (proposal) {
                if (proposal.wallet) return false;
                return proposal.wallet !== 'Paid';
            };

            $scope.hasCart = function (proposal) {
                if (!proposal.cartId) return false;
                return true;
            };

            //Approve Proposal
            $scope.approveProposal = function (proposal) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/templates/brand-approve-proposal-modal.html',
                    controller: 'YesNoConfirmationModalController',
                    size: 'sm',
                    resolve: {
                        campaign: function () {
                            return $scope.proposal.campaign;
                        },
                        proposal: function () {
                            return $scope.proposal;
                        }
                    }
                });

                //on user close
                modalInstance.result.then(function (yesno) {
                    if (yesno == 'yes') {
                        var proposalId = proposal.proposalId;
                        ProposalService.updateStatus(proposalId, "Complete")
                            .then(function (response) {
                                if (response.data.status == 'Complete') {
                                    $window.location.reload();
                                } else {
                                    throw new Error("Status integrity check failed");
                                }
                            })
                            .catch(function (err) {
                                $scope.alert.danger(err.data.message);
                            });
                    }
                });
            };

            //Select Proposal
            $scope.selectProposal = function () {
                ProposalService.addToCart($scope.proposal)
                    .then(function (od) {
                        $state.go('brand-cart');
                    });
            };


            // save post
            $scope.save = function(post, mediaId) {
                var p = _.extend({
                    media: {
                        mediaId: mediaId
                    }
                }, post);

                ProposalService.savePosts($scope.proposalId, p)
                    .then(function(res) {
                        _.extend(post, res.data);
                        $scope.alert.success('บันทึกข้อมูลสำเร็จเรียบร้อย');
                    })
                    .catch(function(e) {
                        $scope.alert.danger(e.data.message);
                    });
            };

            $scope.delete = function(post, mediaId) {
                ProposalService.deletePosts($scope.proposalId, _.extend(post, {media: {mediaId: mediaId}}))
                    .then(function() {
                        _.remove($scope.links[mediaId], function(e) {
                            return e.socialPostId === post.socialPostId;
                        });
                        $scope.alert.success('ลบข้อมูลสำเร็จเรียบร้อย');
                    })
                    .catch(function(e) {
                        $scope.alert.danger(e.data.message);
                    });
            };

            $scope.getPosts = function() {
                ProposalService.getPosts($scope.proposalId)
                    .then(function(res) {
                        _.extend($scope.links, _.groupBy(res.data, function(e) {
                            return e.mediaId;
                        }));
                    });
            };

            //Edit Proposal
            $scope.editProposal = function () {
                //popup a modal
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/templates/influencer-proposal-modal.html',
                    controller: 'ProposalModalController',
                    size: 'md',
                    resolve: {
                        campaign: function () {
                            return $scope.proposal.campaign;
                        },
                        proposal: function () {
                            return $scope.proposal;
                        }
                    }
                });

                //on user close
                modalInstance.result.then(function (proposal) {
                    if (!proposal || !proposal.proposalId) {
                        return;
                    }
                    // $location.reload();
                    window.location.reload();
                    // $state.go('influencer-workroom', { proposalId: proposal.proposalId });
                });
            };

            function scrollBottom() {
                $(".message-area").delay(10).animate({ scrollTop: 500 }, '1000', function () { });
            }

            //get messages
            $scope.proposalId = $stateParams.proposalId;
            ProposalService.getMessages($scope.proposalId, {
                sort: ['createdAt,desc'],
                size: $scope.msgLimit
            }).then(function (res) {
                $scope.totalElements = res.data.totalElements;
                $scope.msglist = res.data.content.reverse();
                _.forEach($scope.msglist, function(e) {
                    $scope.msgHash[e.referenceId] = e;
                });

                //hackish scroll down on load
                $timeout(function () {
                    $scope.scroll = true;
                }, 1000);
                // $scope.poll();
                //scrollBottom();
            });

            $scope.hasPastMessage = function () {
                if(!$scope.msglist) return false;
                if($scope.msglist.length === 0) return false;
                return $scope.totalElements > $scope.msglist.length;
            };

            $scope.loadPastMessage = function () {
                ProposalService.getMessages($scope.proposalId, {
                    sort: ['createdAt,desc'],
                    size: $scope.msgLimit,
                    timestamp: $scope.msglist[0].createdAt
                })
                    .then(function (res) {
                        var btn = $('.message-past button');
                        var pastScroll = btn[0].scrollHeight - btn[0].scrollTop;
                        for (var i = 0; i < res.data.content.length; ++i) {
                            $scope.msglist.unshift(res.data.content[i]);
                        }
                        var area = $('.message-area');
                        area.scrollTop(area[0].scrollHeight - pastScroll);
                    });
            };

            var stop = false;
            var timestamp = moment().add(1, 's').toDate();
            var oldTimestamp = new Date();

            $scope.formData = {
                resources: []
            };
            $scope.alert = new NcAlert();
            $scope.proposal = null;
            $scope.mediaMap = {};

            ProposalService.getOne($scope.proposalId)
                .then(function (proposalResponse) {
                    $scope.proposal = proposalResponse.data;
                    $rootScope.proposal = proposalResponse.data;
                    _.forEach($scope.proposal.media, function(m) {
                      $scope.mediaMap[m.mediaId] = true;
                    });
                    $scope.getPosts();
                    //load transactionid if this is influencer
                    if (UserProfile.get().influencer &&
                        $scope.proposal.status === 'Complete' &&
                        $scope.proposal.wallet &&
                        $scope.proposal.wallet.status === 'Paid') {
                        InfluencerAccountService.getWalletTransaction($scope.proposal.wallet.walletId)
                            .then(function (res) {
                                $scope.transactionId = res.data.transactionId;
                            });
                    }
                    if (UserProfile.get().influencer && !$scope.proposal.rabbitFlag && $scope.proposal.status == 'Selection') {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'components/templates/influencer-proposal-message.modal.html',
                            controller: 'ProposalMessageModalController',
                            size: 'sm',
                            windowClass: 'message-modal',
                            backdrop: 'statusatic',
                            resolve: {
                                email: function () {
                                    return UserProfile.get().email;
                                },
                                proposalId: function () {
                                    return $scope.proposal.proposalId;
                                }
                            }
                        });
                    }
                });


            /* Set Chat Area Height */
            setChatArea();
            $(window).resize(function () {
                $scope.scroll = true;
                setChatArea();
            });

            function setChatArea() {
                var magicNumber = 447;
                var chatArea = $(".message-area");
                var chatAreaHeight = $(window).height() - magicNumber;

                if (chatAreaHeight < 250) {
                    chatAreaHeight = 250;
                }
                chatArea.height(chatAreaHeight);
                chatArea.scrollTop(9999);
            }
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
            return "สูงสุด " + $filter('number')(budgetObject.toBudget) + " บาท";
        };

        //Fetch initial datasets
        DataService.getMedium()
            .then(function (response) {
                $scope.medium = response.data;
                $scope.medium.forEach(function (item) {
                    $scope.mediaObjectDict[item.mediaId] = item;
                });
            })
            .then(function () {
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

        $scope.openCampaign = function () {
            $state.go('brand-campaign-detail-draft', {
                campaignId: $scope.campaignNee.campaignId
            });
        };
        // get follower for this influencer
        function getFollower(data, mediaId) {
            var counter = 0;
            _.forEach(data.influencerMedias, function (e) {
                if (!mediaId || e.media.mediaId === mediaId) {
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
            var summator = function (sum, n) {
                // ignore wrong media
                if (n.mediaId !== mediaId) {
                    return sum;
                }
                // get key list for sum

                keys = keys ? keys : _.keys(_.pickBy(n, function (value, key) {
                    return _.startsWith(key, "sum");
                }));
                // sum each keys
                _.forEach(keys, function (k) {
                    sum[k] = (sum[k] || 0) + n[k];
                    if (mediaId === 'google' && k === 'sumView') {
                        // no need to add
                    } else {
                        sum.sumEngagement = (sum.sumEngagement || 0) + n[k];
                    }
                });

                postKeys = postKeys ? postKeys : _.keys(_.pickBy(sum, function (value, key) {
                    return _.startsWith(key, "sum");
                }));
                // accumulate
                return sum;
            };
            var createDailyFields = function (datasetArray, datasetArrayNext) {
                if (!datasetArrayNext) {
                    return function (key) {
                        var newKey = key.replace('sum', 'daily');
                        datasetArray[newKey] = (datasetArray[key] || 0);
                    };
                }
                return function (key) {
                    var newKey = key.replace('sum', 'daily');
                    datasetArrayNext[newKey] = (datasetArrayNext[key] || 0) - (datasetArray[key] || 0);
                };
            };

            // get only post with mediaId
            _.forEach(data, function (p) {
                var has = false;
                var hasPosts = false;

                // get all posts data
                _.forEach(p.posts, function (e) {
                    if (e.mediaId === mediaId) {
                        posts.push(e);
                        hasPosts = true;
                    }
                });
                _.forEach(p.media, function (e) {
                    if (e.mediaId === mediaId) {
                        has = true;
                    }
                });

                if (!has && !hasPosts) {
                    return;
                }
                // build influencer data
                var influencer = {};

                // get per-influencer data
                influencer.hasPosts = hasPosts;
                _.extend(influencer, p.influencer);
                if (influencer.hasPosts) {
                    var tmp = _.groupBy(p.posts, 'date');
                    var keys = _.reverse(_.sortBy(_.keys(tmp), function (o) {
                        return moment(o.date).toDate();
                    }));
                    var latestPosts = keys.length > 0 ? tmp[keys[0]] : [];
                    _.extend(influencer, _.reduce(latestPosts, summator, {}));
                    influencer.sumFollowerCount = getFollower(p.influencer, mediaId);
                    influencer.sumEngagementRate = influencer.sumFollowerCount > 0 ? Math.round((influencer.sumEngagement / parseFloat(influencer.sumFollowerCount)) * 10000) / 100.0 : null;
                }
                obj.influencers.push(influencer);
            });

            // build per-media

            // dataset by time
            var dataset = _.groupBy(posts, 'date');
            var datasetArray = [];
            _.forOwn(dataset, function (v, k) {
                //sum all data up for this timeframe
                var d = _.reduce(dataset[k], summator, {});
                d.date = k;
                datasetArray.push(d);
            });

            datasetArray = _.sortBy(datasetArray, function (o) {
                return moment(o.date).toDate();
            });

            // create daily-fields
            for (var i = 0; i < datasetArray.length - 1; i++) {
                if (i === 0) {
                    _.forEach(postKeys, createDailyFields(datasetArray[i]));
                }
                _.forEach(postKeys, createDailyFields(datasetArray[i], datasetArray[i + 1]));

            }

            // fill in per-media data
            obj.dataset = datasetArray;
            obj.sumFollowerCount = _.reduce(obj.influencers, function (sum, n) {
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
            obj.sumPrice = _.reduce(data, function (sum, n) {
                return sum + (n.price || 0);
            }, 0);
            obj.sumFollowerCount = _.reduce(data, function (sum, n) {
                return sum + getFollower(n.influencer);
            }, 0);

            // per-media data
            obj.media = {};
            var sumEngagement = 0;
            _.forOwn($scope.mediaObjectDict, function (v, k) {
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
                .then(function (res) {
                    $scope.dashboard = getData(res.data);
                    console.log($scope.dashboard, res.data);
                });
        }
    });
