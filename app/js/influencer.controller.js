require('./service');

angular.module('reachRabbitApp.influencer.controller', ['reachRabbitApp.common.service'])
    .controller('WalletController', function ($rootScope, $scope, $state, UserProfile, InfluencerAccountService, AccountService, DataService, BusinessConfig, NcAlert, validator) {
        $scope.wallet = {};
        $scope.alert = new NcAlert();
        $scope.formData = {};


        AccountService.getProfile().then(function (profile) {
            UserProfile.set(profile.data);
            $scope.isVerify = profile.data.influencer.isVerify;
            $scope.formData.bank = profile.data.influencer.bank;
            $scope.formData.accountNumber = profile.data.influencer.accountNumber;
            $scope.formData.accountName = profile.data.influencer.accountName;
            $scope.formData.rememberBankDetail = true;
        });

        InfluencerAccountService.getWallet().then(function (walletResponse) {
            $scope.wallet = walletResponse.data;
        });

        

        DataService.getBanks().then(function (bankResponse) {
            $scope.bankOptions = bankResponse.data;
        });

        //$scope.PostDeductionFeeMultiplier = (1 - BusinessConfig.INFLUENCER_FEE);
        $scope.TransferFee = -1 * BusinessConfig.INFLUENCER_BANK_TF_FEE;
        $scope.BrandTaxFee = BusinessConfig.BRAND_TAX_FEE;
        //$scope.InfluencerFee = BusinessConfig.INFLUENCER_FEE;


        $scope.calculateIncome = function(proposal) {
            if(!proposal) {
                return 0;
            }
            if(proposal.campaign.brand.isCompany){
                var tax = proposal.price * $scope.BrandTaxFee;
                return proposal.price - tax - proposal.fee;
            } else {
                return proposal.price - proposal.fee;
            }
        };

        $scope.requestPayout = function () {
            //if user chekced the chekbx
            //we save bank detail first
            var o = validator.formValidate($scope.form);
            if (o) {
                return $scope.alert.danger(o.message);
            }

            InfluencerAccountService.requestPayout($scope.formData)
                .then(function (ias) {
                    if ($scope.formData.rememberBankDetail) {
                        AccountService.saveBank({
                            accountName: $scope.formData.accountName,
                            accountNumber: $scope.formData.accountNumber,
                            bank: $scope.formData.bank,
                        }).then(function (res) {
                            UserProfile.set(res.data);
                            $state.go('influencer-payout-history');
                        });
                    } else {
                        $state.go('influencer-payout-history');
                    }
                })
                .catch(function (err) {
                    return $scope.alert.danger(err.data.message);
                });
        };

    })
    .controller('InfluencerCampaignDetailController', function ($scope, $state, $location, $stateParams, CampaignService, NcAlert, AccountService, $uibModal, DataService) {
        $scope.campaignNee = null;
        $scope.isApply = false;
        $scope.alert = new NcAlert();
        $scope.appliedAlert = new NcAlert();

        $scope.proposal = null;

        $scope.keywordMap = function (arr) {
            if (!arr) return [];
            return arr.map(function (k) {
                return k.keyword;
            });
        };

        $scope.sendProposal = function () {
            //popup a modal
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'components/templates/influencer-proposal-modal.html',
                controller: 'ProposalModalController',
                size: 'md',
                resolve: {
                    campaign: function () {
                        return $scope.campaignNee;
                    },
                    proposal: function () {
                        return false;
                    }
                }
            });

            //on user close
            modalInstance.result.then(function (proposal) {
                if (!proposal || !proposal.proposalId) {
                    return;
                }
                $state.go('influencer-workroom', { proposalId: proposal.proposalId });
            });
        };

        $scope.$watch('isApply', function (applied) {
            if (applied) {
                $scope.appliedAlert.info("คุณได้ส่งข้อเสนอให้ Campaign นี้แล้ว");
            }
            $scope.appliedAlert.close();
        });

        var showDialog = $location.search().showDialog;

        CampaignService.getOne($stateParams.campaignId)
            .then(function (campaignResponse) {
                $scope.campaignNee = campaignResponse.data;
                $scope.isApply = $scope.campaignNee.isApply;
                $scope.proposal = $scope.campaignNee.proposal;

                if(showDialog){
                  $scope.sendProposal();
                }

            })
            .catch(function (err) {
                $scope.alert.danger(err.data.message);
            });
    })
    .controller('InfluencerCampaignListController', function ($scope, $state, CampaignService, DataService, ExampleCampaigns, $rootScope, UserProfile) {
            $scope.params = {};
            $scope.filter = {};
            $scope.hasMedia = UserProfile.get().influencer.influencerMedias.length === 0 ? false : true; 

            $scope.handleUserClickThumbnail = function (c) {
                //expire campaign cannot click
                if(c.isApply || !$rootScope.isExpired(c.proposalDeadline)){
                    $state.go('influencer-campaign-detail', {
                        campaignId: c.campaignId
                    });
                }
            };
            $scope.$watch('filter.value', function () {
                $scope.load(_.extend($scope.params, { mediaId: $scope.filter.value }));
            });

            //Load campaign data
            $scope.load = function (data) {
                $scope.params = data;
                CampaignService.getOpenCampaigns(data).then(function (response) {
                    $scope.campaigns = response.data;
                })
                .catch(function (err) {
                    if (err.data.statusCode == 400) {
                        $scope.hasMedia = false;
                    }
                });
            };
            //Init
            $scope.load({
                size: 15,
                sort: 'campaignId,desc'
            });

            //Init media data
            DataService.getMedium()
                .then(function (response) {
                    $scope.filters = _.map(response.data, function (e) {
                        e.mediaName = 'แสดงเฉพาะ ' + e.mediaName;
                        return e;
                    });
                    $scope.filters.unshift({
                        mediaId: undefined,
                        mediaName: 'แสดงทั้งหมด'
                    });
                });
        }
    )
    .controller('InfluencerProfileController', function ($scope, $window, $stateParams, AccountService, NcAlert, UserProfile, validator, util, $anchorScroll, $timeout) {
            util.warnOnExit($scope);
            $scope.showStickyToolbar = !_.isNil($stateParams.showToolbar);
            $scope.form = {};
            $scope.formData = {};
            $scope.alert = new NcAlert();
            $scope.genderOptions = [{
                name: 'ชาย',
                value: 'Male'
            }, {
                    name: 'หญิง',
                    value: 'Female'
                }, {
                    name: 'อื่นๆ',
                    value: 'NotSpecified'
                }];
            $scope.isValidate = function (model, error) {
                if (error === 'required' && model.$name === 'profilePicture') {
                    return $scope.form.$submitted;
                }
                return true;
            };
            $scope.saveProfile = function (profile, bypass, rollback) {
                var o = validator.formValidate($scope.form);
                if (o && !bypass) {
                    return $scope.alert.danger(o.message);
                }

                if (profile.influencer.web && profile.influencer.web.length > 1 && !profile.influencer.web.startsWith("http")) {
                    profile.influencer.web = "http://" + profile.influencer.web;
                }

                AccountService.saveProfile(profile)
                    .then(function (response) {
                        // delete response.data.password;
                        // $scope.formData = response.data;
                        //set back to localstorage
                        UserProfile.set(response.data);

                        $scope.form.$setPristine();
                        $scope.success = true;
                        $scope.alert.success('บันทึกข้อมูลเรียบร้อย!');
                        $scope.profile = _.merge({}, $scope.formData);
                    })
                    .catch(function (err) {
                        if (rollback) {
                            $scope.rollBack();
                        }
                        $scope.alert.danger(err.data.message);
                    });
            };
            $scope.hasMedia = function (mediaId) {
                for (var i = 0; i < _.get($scope.formData, 'influencer.influencerMedias', []).length; i++) {
                    if ($scope.formData.influencer.influencerMedias[i].media.mediaId == mediaId) {
                        return true;
                    }
                }
                return false;
            };
            $scope.linkDone = function (err) {
                if (err) {
                    $scope.alert.danger(err.data.message);
                } else {
                    $scope.saveProfile($scope.formData, true, true);
                }
            };
            $scope.rollBack = function () {
                $scope.formData = _.merge({}, $scope.profile);
            };

            // fetch profile
            AccountService.getProfile()
                .then(function (response) {
                    $scope.formData = response.data;
                    $scope.formData.influencer.categories = $scope.formData.influencer.categories || [];
                    $scope.formData.influencer.user = { name: $scope.formData.name, profilePicture: $scope.formData.profilePicture };

                    // fetch each media
                    if ($scope.hasMedia('google')) {
                        AccountService.getYouTubeProfile()
                            .then(function (response) {
                                $scope.youtube = response.data;
                            });
                    }
                    if ($scope.hasMedia('facebook')) {
                        AccountService.getFacebookProfile()
                            .then(function (response) {
                                $scope.facebook = response.data;
                            });
                    }
                    if ($scope.hasMedia('instagram')) {
                        AccountService.getInstagramProfile()
                            .then(function (response) {
                                $scope.instagram = response.data;
                            });
                    }

                    // assign categories
                    _.forEach($scope.formData.influencer.categories, function (r) {
                        r._selected = true;
                    });

                    //save state
                    $scope.profile = _.merge({}, $scope.formData);

                    if($stateParams.showVerify) {
                        var container = $('html, body');
                        var scrollTo = $('#showVerify');
                        container.animate({
                            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                        }, 700);
                    }
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        }
    )
    .controller('InfluencerInboxController', function ($scope, $filter, $stateParams, ProposalService, moment) {
        $scope.statusCounts = {};
        $scope.statusFilter = 'Selection';
        $scope.showStickyToolbar = false;
        $scope.search = {};



        if ($stateParams.status) {
            $scope.statusFilter = $stateParams.status;
        }
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
            //Selection status
            ProposalService.count({
                status: 'Selection'
            }).then(function (res) {
                $scope.statusCounts.selection = res.data;
            });
            //Working status
            ProposalService.count({
                status: 'Working'
            }).then(function (res) {
                $scope.statusCounts.working = res.data;
            });
            //Complete status
            ProposalService.count({
                status: 'Complete'
            }).then(function (res) {
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
        });

        $scope.loadProposalCounts();

    })
    .controller('PublicCampaignController', function ($scope,$stateParams, PublicService) {
        $scope.campaignNee = null;
        PublicService.getCampaign($stateParams.campaignId).then(function(x){
            $scope.campaignNee = x.data;
        });
    });