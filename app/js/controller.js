/**
 * Controllers
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Natt Phenjati <natt@phenjati.com>
 * @author     Poon Wu <poon.wu@gmail.com>
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
    .controller('EmptyController', ['$scope', '$uibModal', function ($scope, $uibModal) {
        $scope.testHit = function () {
            var scope = $scope;
            // console.log("Test World");
        };
    }])
    .controller('TransactionDetailController', ['$scope', 'NcAlert', '$stateParams', 'TransactionService', 'AdminService', function ($scope, NcAlert, $stateParams, TransactionService, AdminService) {
        var cartId = $stateParams.cartId;
        $scope.alert = new NcAlert();

        var loadData = function () {
            TransactionService.getByCart(cartId)
                .then(function (transaction) {
                    $scope.transaction = transaction.data;

                    if ($scope.isExpired()) {
                        $scope.alert.warning("การสั่งซื้อนี้ได้หมดอายุลงแล้ว");
                    }
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };

        loadData();

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

        $scope.approve = function () {
            AdminService.confirmTransaction($scope.transaction)
                .then(function (response) {
                    loadData();
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };



    }])
    .controller('ProposalModalController', ['$scope', 'DataService', 'CampaignService', 'ProposalService', 'campaign', '$state', 'NcAlert', '$uibModalInstance', '$rootScope', 'proposal', 'validator', 'util',
        function ($scope, DataService, CampaignService, ProposalService, campaign, $state, NcAlert, $uibModalInstance, $rootScope, proposal, validator, util) {
            $scope.completionTimes = [];
            $scope.medium = [];
            $scope.formData = {
                media: []
            };
            $scope.isEditMode = (proposal !== false);
            $scope.campaign = campaign;
            $scope.proposalNetPrice = 0.00;
            $scope.alert = new NcAlert();
            $scope.selectedMedia = {};
            $scope.form = {};

            util.warnOnExit($scope);

            if ($scope.isEditMode) {
                proposal.media.forEach(function (infm) {
                    console.log(infm);
                    $scope.selectedMedia[infm.mediaId] = true;
                });
                $scope.formData = proposal;
                //Selected Media Theorem
            }

            /*
             *  Check if profile has linked media id
             */
            $scope.profileHasMedia = function (mediaId) {
                // console.log($rootScope.getProfile().influencer.influencerMedias);
                return _.findIndex($rootScope.getProfile().influencer.influencerMedias, function (e) {
                    return _.get(e, 'media.mediaId') === mediaId;
                }) >= 0;
            };

            $scope.$watch('selectedMedia', function (selectedMedia) {
                $scope.formData.media = [];
                /*
                 * loop over selected media key
                 */
                Object.keys(selectedMedia).forEach(function (smk) {
                    //smk = selected media key
                    if (!selectedMedia[smk]) return;
                    $scope.formData.media.push({
                        mediaId: smk
                    });
                });

            }, true);

            $scope.submit = function (formData) {
                var o = validator.formValidate($scope.form);
                if (o) {
                    return $scope.alert.danger(o.message);
                }

                var action = CampaignService.sendProposal;
                if (formData.proposalId) {
                    action = ProposalService.update;
                } else {
                    action = CampaignService.sendProposal;
                }

                action(formData, campaign.campaignId)
                    .then(function (doneR) {
                        $scope.form.$setPristine();
                        return $uibModalInstance.close(doneR.data);
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });

            };

            $scope.$watch('formData.price', function (pp) {
                $scope.proposalNetPrice = Number(pp) * 0.820;
            });

            DataService.getMedium().then(function (response) {
                $scope.medium = response.data;
            });

            DataService.getCompletionTime().then(function (response) {
                $scope.completionTimes = response.data;
            });
        }
    ])
    .controller('WorkroomController', ['$scope', '$uibModal', '$interval','$rootScope', '$stateParams', 'ProposalService', 'NcAlert', '$state', '$location', '$window', 'util',
        function ($scope, $uibModal, $interval, $rootScope, $stateParams, ProposalService, NcAlert, $state, $location, $window, util) {
            $scope.msglist = [];
            $scope.msgLimit = 30;
            $scope.totalElements = 0;
            util.warnOnExit($scope);

            $scope.alert = new NcAlert();
            
            $scope.hasInWallet = function(proposal){
                if(!$rootScope.wallet) return false;
                if(!$rootScope.wallet.proposals) return false;
                return _.find($rootScope.wallet.proposals, function(pred){
                    return pred.proposalId == proposal;
                });
            };
			
			$scope.hasCart = function(proposal){
                if(!proposal.cartId) return false;
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

            $scope.proposalId = $stateParams.proposalId;
            ProposalService.getMessages($scope.proposalId, {
                sort: ['createdAt,desc'],
                size: $scope.msgLimit
            }).then(function (res) {
                $scope.totalElements = res.data.totalElements;
                $scope.msglist = res.data.content.reverse();
                // $scope.poll();
                //scrollBottom();
            });

            $scope.hasPastMessage = function () {
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

            $interval(function () {
                if ($scope.pollActive === true) {
                    return;
                }
                console.log("will poll");
                $scope.pollActive = true;
                ProposalService.getMessagesPoll($scope.proposalId, {
                    timestamp: $scope.msglist.length > 0 ? $scope.msglist[$scope.msglist.length - 1].createdAt : new Date()
                })
                    .then(function (res) {
                        $scope.pollActive = false;
                        $scope.totalElements += res.data.length;
                        for (var i = res.data.length - 1; i >= 0; i--) {
                            if ($scope.msglist.length >= $scope.msgLimit) {
                                $scope.msglist.shift();
                            }
                            $scope.msglist.push(res.data[i]);
                        }
                    })
                    .finally(function () {
                        if (!stop) {
                            console.log("done poll");
                            // $scope.poll();
                            // $scope.pollActive = false;
                        }
                    });
            }, 1000);


            $scope.$on('$destroy', function () {
                stop = true;
                $interval.cancel();
            });

            $scope.formData = {
                resources: []
            };
            $scope.alert = new NcAlert();
            $scope.sendMessage = function (messageStr, attachments) {
                if (_.isEmpty(messageStr) && _.isEmpty(attachments)) {
                    return;
                }
                ProposalService.sendMessage({
                    message: messageStr,
                    proposal: {
                        proposalId: $scope.proposalId
                    },
                    resources: attachments
                })
                    .then(function (resp) {
                        //$scope.msglist.push(resp.data);
                        $scope.formData = {
                            resources: []
                        };
                        $scope.form.$setPristine();
                        //scrollBottom();
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.message);
                    });
            };

            $scope.proposal = null;

            ProposalService.getOne($scope.proposalId)
                .then(function (proposalResponse) {
                    $scope.proposal = proposalResponse.data;
                });

            /* JS for Chat Area */
            setChatArea();

            $(window).resize(function () {
                setChatArea();
            });

            function setChatArea() {
                var magicNumber = 352;
                var chatArea = $(".message-area");
                var chatAreaHeight = $(window).height() - magicNumber;

                if (chatAreaHeight < magicNumber) {
                    chatAreaHeight = magicNumber;
                }
                chatArea.height(chatAreaHeight);
                chatArea.scrollTop(9999);
            }
        }
    ])
    .controller('PayoutHistoryController', ['$scope', '$state', 'TransactionService', function ($scope, $state, TransactionService) {
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
    }])
    .controller('PayoutDetailController', ['$scope', 'TransactionService', 'AdminService', 'NcAlert', '$state', '$stateParams', function ($scope, TransactionService, AdminService, NcAlert, $state, $stateParams) {
        $scope.alert = new NcAlert();
        var loadTdoc = function () {
            $scope.tDoc = [];

            TransactionService.getByTransactionId($stateParams.transactionId)
                .then(function (response) {
                    $scope.payout = response.data;
                    var _base = null;
                    $scope.payout.influencerTransactionDocument
                        .sort(function (i, x) {
                            return i.documentId - x.documentId;
                        })
                        .forEach(function (sortedDoc) {
                            if (sortedDoc.type == "Base") {
                                var item = {
                                    title: sortedDoc.wallet.proposals[0].campaign.title,
                                    price: sortedDoc.amount
                                };

                                _base = item;
                                $scope.tDoc.push(item);
                            } else if (sortedDoc.type == "Fee") {
                                _base.fee = sortedDoc.amount;
                            } else if (sortedDoc.type == 'TransferFee') {
                                $scope.transferFeeDoc = sortedDoc;
                            }
                        });
                });
        };
        loadTdoc();

        $scope.adminConfirm = function () {
            AdminService.confirmPayout($stateParams.transactionId, $scope.slipResource)
                .then(function () {
                    loadTdoc();
                })
                .catch(function(err){
                    $scope.alert.danger(err.data.message);
                });
        };

    }])
    .controller('YesNoConfirmationModalController', ['$scope', 'DataService', 'CampaignService', 'ProposalService', 'campaign', '$state', 'NcAlert', '$uibModalInstance', '$rootScope', 'proposal',
        function ($scope, DataService, CampaignService, ProposalService, campaign, $state, NcAlert, $uibModalInstance, $rootScope, proposal) {
            $scope.yes = function () {
                $uibModalInstance.close('yes');
            };
        }]);
/////////////// /////////////// /////////////// /////////////// ///////////////
/*
    INFLUENCER
*/
/////////////// /////////////// /////////////// /////////////// ///////////////

angular.module('myApp.influencer.controller', ['myApp.service'])
    .controller('WalletController', ['$scope', '$state', 'UserProfile', 'InfluencerAccountService', 'AccountService', 'DataService', 'BusinessConfig', 'NcAlert', function ($scope, $state, UserProfile, InfluencerAccountService, AccountService, DataService, BusinessConfig, NcAlert) {
        $scope.wallet = {};
        $scope.alert = new NcAlert();
        $scope.formData = {};

        AccountService.getProfile().then(function(profile){
            UserProfile.set(profile);
            $scope.formData.bank = profile.influencer.bank;
            $scope.formData.accountNumber = profile.influencer.accountNumber;
            $scope.formData.accountName = profile.influencer.accountName;
        });

        InfluencerAccountService.getWallet().then(function (walletResponse) {
            $scope.wallet = walletResponse.data;
        });

        DataService.getBanks().then(function (bankResponse) {
            $scope.bankOptions = bankResponse.data;
        });

        $scope.PostDeductionFeeMultiplier = (1 - BusinessConfig.INFLUENCER_FEE);
        $scope.TransferFee = -1 * BusinessConfig.INFLUENCER_BANK_TF_FEE;

        $scope.requestPayout = function () {
            //if user chekced the chekbx
            //we save bank detail first

            InfluencerAccountService.requestPayout($scope.formData)
                .then(function (ias) {
                    if($scope.rememberBankDetail){
                        AccountService.saveBank({
                            accountName: $scope.formData.accountName,
                            accountNumber: $scope.formData.accountNumber,
                            bank: $scope.formData.bank,
                        }).then(function(){
                            $state.go('influencer-payout-history');
                        });
                    }else{
                        $state.go('influencer-payout-history');
                    }
                })
                .catch(function (err) {
                    return $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('InfluencerCampaignDetailController', ['$scope', '$state', '$stateParams', 'CampaignService', 'NcAlert', 'AccountService', '$uibModal', 'DataService',
        function ($scope, $state, $stateParams, CampaignService, NcAlert, AccountService, $uibModal, DataService) {
            $scope.campaignNee = null;
            $scope.isApplied = false;
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



            $scope.$watch('isApplied', function (applied) {
                if (applied) {
                    $scope.appliedAlert.info("คุณได้ส่งข้อเสนอให้ Campaign นี้แล้ว");
                }
                $scope.appliedAlert.close();
            });

            CampaignService.getOne($stateParams.campaignId)
                .then(function (campaignResponse) {
                    $scope.campaignNee = campaignResponse.data;
                    CampaignService.getAppliedProposal(campaignResponse.data.campaignId)
                        .then(function (response) {
                            $scope.isApplied = _.has(response.data, 'proposalId');
                            if ($scope.isApplied) {
                                $scope.proposal = response.data;
                            }
                        });

                    return AccountService.getUser($scope.campaignNee.brandId);
                })
                .then(function (brandUserDataResponse) {
                    $scope.brandUserInfo = brandUserDataResponse.data;
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });


        }
    ])
    .controller('InfluencerCampaignListController', ['$scope', '$state', 'CampaignService', 'DataService', 'ExampleCampaigns', '$rootScope',
        function ($scope, $state, CampaignService, DataService, ExampleCampaigns, $rootScope) {
            $scope.params = {};

            $scope.handleUserClickThumbnail = function (c) {
                $state.go('influencer-campaign-detail', {
                    campaignId: c.campaignId
                });
            };
            $scope.$watch('filter', function () {
                $scope.load(_.extend($scope.params, { mediaId: $scope.filter }));
            });

            //Load campaign data
            $scope.load = function (data) {
                $scope.params = data;
                CampaignService.getOpenCampaigns(data).then(function (response) {
                    $scope.campaigns = response.data;
                });
            };
            //Init
            $scope.load({
                size: 1000,
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
    ])
    .controller('InfluencerProfileController', ['$scope', '$window', 'AccountService', 'NcAlert', 'UserProfile', 'validator', 'util',
        function ($scope, $window, AccountService, NcAlert, UserProfile, validator, util) {
            $scope.formData = {};
            $scope.form = {};
            $scope.alert = new NcAlert();
            util.warnOnExit($scope);

            $scope.isValidate = function (model, error) {
                if (error === 'required' && model.$name === 'profilePicture') {
                    return $scope.form.$submitted;
                }
                return true;
            };
            $scope.saveProfile = function (profile, bypass) {
                var o = validator.formValidate($scope.form);
                if (o && !bypass) {
                    return $scope.alert.danger(o.message);
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
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });
            };

            $scope.linkDone = function () {
                $scope.saveProfile($scope.formData, true);
            };

            AccountService.getProfile()
                .then(function (response) {
                    $scope.formData = response.data;
                    $scope.formData.influencer.categories = $scope.formData.influencer.categories || [];

                    _.forEach($scope.formData.influencer.categories, function (r) {
                        r._selected = true;
                    });
                    delete $scope.formData.password;
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });

        }
    ])
    .controller('InfluencerInboxController', ['$scope', '$filter', '$stateParams', 'ProposalService', 'moment', function ($scope, $filter, $stateParams, ProposalService, moment) {
        $scope.statusCounts = {};
        $scope.statusFilter = 'Selection';

        if ($stateParams.status) {
            $scope.statusFilter = $stateParams.status;
        }

        $scope.load = function (params) {
            $scope.params = params;
            $scope.params.status = $scope.statusFilter;

            ProposalService.getAll(params)
                .then(function (response) {
                    $scope.proposals = response.data;

                    _.forEach($scope.proposals.content, function (proposal) {
                        ProposalService.countUnreadMessages(proposal.proposalId)
                            .then(function (res) {
                                proposal.unread = res.data;
                            });
                    });
                });
            ProposalService.getActive()
                .then(function (response) {
                    $scope.filters = _.map(response.data, function (e) {
                        return {
                            name: 'แสดงเฉพาะ Campaign ' + e.campaign.title,
                            campaignId: e.campaign.campaignId
                        };
                    });
                    $scope.filters.unshift({
                        name: 'แสดง Campaign ทั้งหมด',
                        campaignId: undefined
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
        $scope.$watch('filter', function () {
            _.extend($scope.params, {
                campaignId: $scope.filter
            });
            $scope.load($scope.params);
        });

        $scope.load({
            sort: ['messageUpdatedAt,desc']
        });

        $scope.loadProposalCounts();

    }])
    .controller('InfluencerBrandProfileController', ['$scope', 'AccountService', '$stateParams', function ($scope, AccountService, $stateParams) {
        AccountService.getProfile($stateParams.brandId)
            .then(function (response) {
                $scope.brand = response.data;
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
    .controller('CampaignListController', ['$scope', 'CampaignService', 'DataService', 'ExampleCampaigns', function ($scope, CampaignService, DataService, ExampleCampaigns) {
        $scope.testHit = function () {
            var scope = $scope;
            console.log("Test World");
        };

        $scope.myCampaign = [];
        $scope.$watch('filter', function () {
            $scope.load(_.extend($scope.params, { mediaId: $scope.filter }));
        });

        //Load campaign data
        $scope.load = function (data) {
            $scope.params = data;
            CampaignService.getAll(data).then(function (response) {
                $scope.myCampaign = response.data;
            });
        };
        //Init
        $scope.load();

        //Example campaign section
        $scope.exampleCampaign = ExampleCampaigns;
    }])
    .controller('CampaignExampleController', ['$scope', '$stateParams', 'ExampleCampaigns', function ($scope, $stateParams, ExampleCampaigns) {
        $scope.exampleCampaign = ExampleCampaigns[$stateParams.exampleId];
    }])
    .controller('CampaignDetailController', ['$scope', '$rootScope', '$stateParams', 'CampaignService', 'DataService', '$filter', 'UserProfile', 'NcAlert', 'validator', '$state', 'util',
        function ($scope, $rootScope, $stateParams, CampaignService, DataService, $filter, UserProfile, NcAlert, validator, $state, util) {
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

            $scope.campaignNee = $scope.formData;

            $scope.mediaBooleanDict = {};
            $scope.mediaObjectDict = {};
            $scope.categories = [];
            $scope.budgets = [];

            DataService.getBudgets().then(function (resp) {
                $scope.budgets = resp.data;
            });

            $scope.dateOptions = _.extend({}, $rootScope.dateOptions, {
                minDate: new Date()
            });

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

                        if (!$scope.formData.brand) {
                            $scope.formData.brand = UserProfile.get().brand;
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

            $scope.isInvalidMedia = function () {
                return $scope.formData.media.length === 0 && $scope.form.$submitted && $scope.formData.status == 'Open';
            };
            $scope.isPublishing = function (model, key) {
                //Only validate publish for resource
                if (model && model.$name === 'resource' && key !== 'required') {
                    return true;
                }
                return $scope.formData.status === 'Open';
            };

            $scope.save = function (formData, mediaBooleanDict, mediaObjectDict, status) {
                formData.brand = UserProfile.get().brand;
                formData.status = status;

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
                            $state.go('brand-campaign-detail-published', { campaignId: echoresponse.data.campaignId, alert: "ลงประกาศเรียบร้อย" });
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
    ])
    .controller('BrandProfileController', ['$scope', '$window', 'AccountService', 'NcAlert', 'UserProfile', 'validator', 'util', function ($scope, $window, AccountService, NcAlert, UserProfile, validator, util) {
        $scope.formData = {};
        $scope.form = {};
        $scope.alert = new NcAlert();
        util.warnOnExit($scope);

        AccountService.getProfile()
            .then(function (response) {
                $scope.formData = response.data;
                delete $scope.formData.password;
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
            AccountService.saveProfile(profile)
                .then(function (response) {
                    delete response.data.password;
                    $scope.formData = response.data;
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
    }])
    .controller('BrandInboxController', ['$scope', '$filter', 'ProposalService', 'CampaignService', 'moment', '$stateParams', function ($scope, $filter, ProposalService, CampaignService, moment, $stateParams) {
        $scope.statusCounts = {};
        $scope.statusFilter = 'Selection';

        if ($stateParams.status) {
            $scope.statusFilter = $stateParams.status;
        }

        $scope.load = function (params) {
            $scope.params = params;
            $scope.params.status = $scope.statusFilter;

            ProposalService.getAll(params)
                .then(function (response) {
                    $scope.proposals = response.data;
                    _.forEach($scope.proposals.content, function (proposal) {
                        ProposalService.countUnreadMessages(proposal.proposalId)
                            .then(function (res) {
                                proposal.unread = res.data;
                            });
                    });
                });
            CampaignService.getActiveCampaigns()
                .then(function (response) {
                    $scope.filters = _.map(response.data, function (e) {
                        return {
                            name: 'แสดงเฉพาะ Campaign ' + e.title,
                            campaignId: e.campaignId
                        };
                    });
                    $scope.filters.unshift({
                        name: 'แสดง Campaign ทั้งหมด',
                        campaignId: undefined
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
        $scope.$watch('filter', function () {
            _.extend($scope.params, {
                campaignId: $scope.filter
            });
            $scope.load($scope.params);
        });
        $scope.load({
            sort: ['messageUpdatedAt,desc']
        });
        $scope.loadProposalCounts();
    }])
    .controller('CartController', ['$scope', '$rootScope', '$state', 'NcAlert', 'BrandAccountService', 'ProposalService', 'TransactionService', '$stateParams', function ($scope,$rootScope, $state, NcAlert, BrandAccountService, ProposalService, TransactionService, $stateParams) {
        $scope.alert = new NcAlert();
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
    }])
    .controller('BrandInfluencerProfile', ['$scope', 'NcAlert', 'AccountService', '$stateParams', function ($scope, NcAlert, AccountService, $stateParams) {
        $scope.alert = new NcAlert();
        AccountService.getProfile($stateParams.influencerId)
            .then(function (response) {
                $scope.influencer = response.data;
            });

    }])
    .controller('TransactionHistoryController', ['$scope', 'NcAlert', '$state', '$stateParams', 'TransactionService', function ($scope, NcAlert, $state, $stateParams, TransactionService) {
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
    }])
    .controller('TransactionController', ['$scope', 'NcAlert', '$stateParams', 'TransactionService', function ($scope, NcAlert, $stateParams, TransactionService) {
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
        var u = UserProfile.get();

        $scope.formData = {};

        if (_.get(u, 'influencer')) {
            $window.location.href = "/influencer.html#/influencer-campaign-list";
            return;
        }

        if (_.get(u, 'brand')) {
            $window.location.href = "/brand.html#/brand-campaign-list";
            return;
        }
        $window.localStorage.removeItem('token');
        $scope.messageCode = $location.search().message;
        $scope.alert = new NcAlert();

        if ($scope.messageCode == "401") {
            $scope.alert.warning("<strong>401</strong> Unauthorized or Session Expired");
        }

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
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());

                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal.html#/brand-login");
                    $window.location.href = '/brand.html#/brand-campaign-list';
                    // $location.path('/brand.html#/brand-campaign-list')
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('AdminSigninController', ['$scope', '$rootScope', '$location', 'AccountService', 'UserProfile', '$window', 'NcAlert', function ($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
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
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());

                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal.html#/admin-login");
                    $window.location.href = '/admin.html#/admin-transaction-history';
                    // $location.path('/brand.html#/brand-campaign-list')
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('InfluencerSigninController', ['$scope', '$rootScope', '$location', 'AccountService', 'UserProfile', '$window', 'NcAlert', function ($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
        $scope.formData = {};
        $window.localStorage.removeItem('token');
        $scope.messageCode = $location.search().message;
        $scope.alert = new NcAlert();

        if ($scope.messageCode == "401") {
            $scope.alert.warning("<strong>401</strong> Unauthorized or Session Expired");
        }

        $scope.login = function (username, password) {
            $location.search('message', 'nop');
            AccountService.getTokenInfluencer(username, password)
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
                    $rootScope.setUnauthorizedRoute("/portal.html#/influencer-portal");
                    $window.location.href = '/influencer.html#/influencer-campaign-list';
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('InfluencerJesusController', ['$scope', '$rootScope', '$location', 'AccountService', 'UserProfile', '$window', 'NcAlert', function ($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
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
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());
                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal.html#/influencer-login");
                    $window.location.href = '/influencer.html#/influencer-campaign-list';
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('InfluencerPortalController', ['$scope', '$rootScope', 'NcAlert', '$auth', '$state', '$stateParams', 'AccountService', 'UserProfile', '$window', 'BusinessConfig',
        function ($scope, $rootScope, NcAlert, $auth, $state, $stateParams, AccountService, UserProfile, $window, BusinessConfig) {
            $scope.alert = new NcAlert();
            $scope.minFollower = BusinessConfig.MIN_FOLLOWER_COUNT;

            if ($stateParams.alert) {
                $scope.alert[$stateParams.alert.type]($stateParams.alert.message);
            }

            $scope.startAuthFlow = function (mediaId) {
                $scope.minFollowerError = false;
                $window.localStorage.clear();
                $auth.authenticate(mediaId)
                    .then(function (response) {
                        // console.log('Response', response.data);
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
                            // console.log(response.data);
                            if (mediaId == 'facebook') {
                                $state.go('influencer-signup-select-page', { authData: response.data });
                            } else {
                                if (response.data.pages[0].count < $scope.minFollower) {
                                    $scope.minFollowerError = true;
                                    return;
                                }
                                $state.go('influencer-signup-confirmation', { authData: response.data });
                            }
                        }



                    });
            };

        }
    ])
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
            if ($stateParams.fromState) {
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
    .controller('InfluencerSignUpController', ['$scope', '$rootScope', 'NcAlert', '$auth', '$state', '$stateParams', 'InfluencerAccountService', 'AccountService', 'UserProfile', '$window', 'ResourceService', 'BusinessConfig', 'validator', 'util',
        function ($scope, $rootScope, NcAlert, $auth, $state, $stateParams, InfluencerAccountService, AccountService, UserProfile, $window, ResourceService, BusinessConfig, validator, util) {

            var profile = $stateParams.authData;
            $scope.alert = new NcAlert();
            $scope.form = {};

            util.warnOnExit($scope);

            //TODO : get value from provider somewhere or smth
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
                if (o) {
                    $scope.alert.danger(o.message);
                    return;
                }

                InfluencerAccountService.signup({
                    name: $scope.formData.name,
                    email: $scope.formData.email,
                    phoneNumber: $scope.formData.phoneNumber,
                    influencerMedia: [{
                        media: $scope.formData.media,
                        socialId: $scope.formData.id,
                        followerCount: $scope.formData.pages[0].count,
                        pageId: $scope.formData.pageId || null
                    }],
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
                        $scope.form.$setPristine();
                        //Redirect change app
                        $window.location.href = '/influencer.html#/influencer-campaign-list';
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });
            };
        }
    ])
    .controller('BrandSignupController', ['$scope', '$state', '$rootScope', 'BrandAccountService', 'AccountService', 'UserProfile', '$location', '$window', 'NcAlert', 'util',
        function ($scope, $state, $rootScope, BrandAccountService, AccountService, UserProfile, $location, $window, NcAlert, util) {

            $scope.formData = {};
            $scope.form = {};
            $scope.alert = new NcAlert();
            util.warnOnExit($scope);

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
                        $scope.form.$setPristine();
                        // $location.update('/brand.html#/brand-campaign-list');
                        $window.location.href = '/brand.html#/brand-campaign-list';
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });
            };

        }
    ]);

/*/////////////// /////////////// /////////////// /////////////// ///////////////

      _        ______     ____    ____   _____   ____  _____
     / \      |_   _ `.  |_   \  /   _| |_   _| |_   \|_   _|
    / _ \       | | `. \   |   \/   |     | |     |   \ | |
   / ___ \      | |  | |   | |\  /| |     | |     | |\ \| |
 _/ /   \ \_   _| |_.' /  _| |_\/_| |_   _| |_   _| |_\   |_
|____| |____| |______.'  |_____||_____| |_____| |_____|\____|


/////////////// /////////////// /////////////// /////////////// ///////////////*/
angular.module('myApp.admin.controller', ['myApp.service'])
    .controller('AdminTransactionHistoryController', ['$scope', '$state', 'TransactionService', function ($scope, $state, TransactionService) {
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
    }])
    .controller('AdminPayoutHistoryController', ['$scope', '$state', 'TransactionService', function ($scope, $state, TransactionService) {
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
    }]);
