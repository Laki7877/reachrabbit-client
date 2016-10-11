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



angular.module('reachRabbitApp.controller', ['reachRabbitApp.service'])
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
    .controller('WorkroomController', ['$scope', 'UserProfile', '$uibModal', '$interval', '$rootScope', '$stateParams', 'ProposalService', 'NcAlert', '$state', '$location', '$window', 'util', 'LongPollingService', '$timeout', 'InfluencerAccountService',
        function ($scope, UserProfile, $uibModal, $interval, $rootScope, $stateParams, ProposalService, NcAlert, $state, $location, $window, util, LongPollingService, $timeout, InfluencerAccountService) {
            $scope.msglist = [];
            $scope.msgHash = {};
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

            $scope.intersectMedia = function (media, mediaInfluencer) {
                return _.intersectionBy((mediaInfluencer || []).map(function (mi) {
                    mi.mediaId = mi.media.mediaId;
                    return mi;
                }), media, 'mediaId');
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
            var interval = $interval(function () {
                if ($scope.pollActive || stop) {
                    return;
                }
                $scope.pollActive = true;
                LongPollingService.getMessagesPoll($scope.proposalId, {
                    timestamp: timestamp
                })
                    .then(function (res) {
                        if (!res.data || stop) {
                            return null;
                        }
                        timestamp = res.data[1];
                        oldTimestamp = res.data[0];
                        return ProposalService.getNewMessages($scope.proposalId, {
                            timestamp: oldTimestamp
                        });
                    })
                    .then(function (res) {
                        if (res && res.data) {
                            $scope.totalElements += res.data.length;
                            for (var i = res.data.length - 1; i >= 0; i--) {
                                if ($scope.msglist.length >= $scope.msgLimit) {
                                    $scope.msglist.shift();
                                }
                                if (!_.isNil($scope.msgHash[res.data[i].referenceId])) {
                                    _.extend($scope.msgHash[res.data[i].referenceId], res.data[i]);
                                } else {
                                    // from server
                                    $scope.msglist.push(res.data[i]);
                                }
                            }
                        }
                    })
                    .finally(function () {
                        $scope.pollActive = false;
                    });
            }, 1000);


            $scope.$on('$destroy', function () {
                stop = true;
                $interval.cancel(interval);
            });

            $scope.formData = {
                resources: []
            };
            $scope.alert = new NcAlert();
            $scope.sendMessage = function (messageStr, attachments) {
                if (_.isEmpty(messageStr) && _.isEmpty(attachments)) {
                    return;
                }
                var msg = {
                    message: messageStr,
                    proposal: $scope.proposal,
                    user: $rootScope.getProfile(),
                    resources: attachments,
                    referenceId: sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(new Date().getTime()))
                };

                $scope.msglist.push(msg);
                $scope.msgHash[msg.referenceId] = msg;
                $scope.formData.messageStr = '';
                ProposalService.sendMessage(_.extend(_.omit(msg, 'user'), { proposal: { proposalId: $scope.proposalId } }))
                    .then(function (resp) {
                        _.extend(msg, resp.data);
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
                    $rootScope.proposal = proposalResponse.data;
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
                            backdrop: 'static',
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
                var magicNumber = 437;
                var chatArea = $(".message-area");
                var chatAreaHeight = $(window).height() - magicNumber;

                if (chatAreaHeight < 250) {
                    chatAreaHeight = 250;
                }
                chatArea.height(chatAreaHeight);
                chatArea.scrollTop(9999);
            }
        }
    ])
    .controller('InfluencerProfilePortfolioController', ['$scope', 'NcAlert', 'AccountService', '$stateParams', function ($scope, NcAlert, AccountService, $stateParams) {
        $scope.formData = {};
        $scope.alert = new NcAlert();
        if($stateParams.proposalId) {
            $scope.proposalId = $stateParams.proposalId;
        }
        $scope.hasMedia = function (mediaId) {
            for (var i = 0; i < _.get($scope.formData, 'influencer.influencerMedias', []).length; i++) {
                if ($scope.formData.influencer.influencerMedias[i].media.mediaId == mediaId) {
                    return true;
                }
            }
            return false;
        };
        // fetch profile
        AccountService.getProfile($stateParams.influencerId)
            .then(function (response) {
                $scope.formData = response.data;
                $scope.formData.influencer.categories = $scope.formData.influencer.categories || [];
                $scope.formData.influencer.user = $scope.formData;

                // fetch each media
                if ($scope.hasMedia('google')) {
                    AccountService.getYouTubeProfile($stateParams.influencerId)
                        .then(function (response) {
                            $scope.youtube = response.data;
                        });
                }
                if ($scope.hasMedia('facebook')) {
                    AccountService.getFacebookProfile($stateParams.influencerId)
                        .then(function (response) {
                            $scope.facebook = response.data;
                        });
                }
                if ($scope.hasMedia('instagram')) {
                    AccountService.getInstagramProfile($stateParams.influencerId)
                        .then(function (response) {
                            $scope.instagram = response.data;
                        });
                }

                // assign categories
                _.forEach($scope.formData.influencer.categories, function (r) {
                    r._selected = true;
                });
                delete $scope.formData.password;
            })
            .catch(function (err) {
                $scope.alert.danger(err.data.message);
            });
    }])
    .controller('BrandProfilePortfolioController', ['$scope', 'AccountService', '$stateParams', function ($scope, AccountService, $stateParams) {
        if($stateParams.proposalId) {
            $scope.proposalId = $stateParams.proposalId;
        }
        AccountService.getProfile($stateParams.brandId)
            .then(function (response) {
                $scope.brand = response.data;
            });
    }])
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
    .controller('PayoutDetailController', ['$scope', 'WalletService', 'AdminService', 'AccountService', 'NcAlert', '$state', '$stateParams', 'UserProfile', function ($scope, WalletService, AdminService, AccountService, NcAlert, $state, $stateParams, UserProfile) {
        $scope.alert = new NcAlert();
        var loadTdoc = function () {
            $scope.tDoc = [];
            WalletService.getWalletTransaction($stateParams.walletId)
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

                    if (UserProfile.get().influencer) {
                        return UserProfile.get();
                    }

                    return AccountService.getUser($scope.payout.userId);
                })
                .then(function (res) {
                    $scope.user = res.data;
                });
        };
        loadTdoc();
        $scope.formData = {};

        $scope.adminConfirm = function () {
            AdminService.confirmPayout($scope.payout.transactionId, $scope.formData.slipResource)
                .then(function () {
                    loadTdoc();
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };

    }])
    .controller('YesNoConfirmationModalController', ['$scope', 'DataService', 'CampaignService', 'ProposalService', 'campaign', '$state', 'NcAlert', '$uibModalInstance', '$rootScope', 'proposal',
        function ($scope, DataService, CampaignService, ProposalService, campaign, $state, NcAlert, $uibModalInstance, $rootScope, proposal) {
            $scope.yes = function () {
                $uibModalInstance.close('yes');
            };
        }])
    .controller('CampaignMessageModalController', ['$scope', 'email', 'campaignId', 'CampaignService', '$uibModalInstance',
        function ($scope, email, campaignId, CampaignService, $uibModalInstance) {
            $scope.email = email;
            $scope.notify = false;
            $scope.dismiss = function () {
                if ($scope.notify) {
                    CampaignService.dismissNotification(campaignId)
                        .then(function () {
                            $uibModalInstance.close();
                        });
                }
                $uibModalInstance.close();
            };
        }])
    .controller('ProposalMessageModalController', ['$scope', 'email', 'proposalId', 'ProposalService', '$uibModalInstance',
        function ($scope, email, proposalId, ProposalService, $uibModalInstance) {
            $scope.email = email;
            $scope.notify = false;
            $scope.dismiss = function () {
                if ($scope.notify) {
                    ProposalService.dismissNotification(proposalId)
                        .then(function () {
                            $uibModalInstance.close();
                        });
                }
                $uibModalInstance.close();
            };
        }]);
/////////////// /////////////// /////////////// /////////////// ///////////////

angular.module('reachRabbitApp.influencer.controller', ['reachRabbitApp.service'])
    .controller('WalletController', ['$rootScope', '$scope', '$state', 'UserProfile', 'InfluencerAccountService', 'AccountService', 'DataService', 'BusinessConfig', 'NcAlert', 'validator', function ($rootScope, $scope, $state, UserProfile, InfluencerAccountService, AccountService, DataService, BusinessConfig, NcAlert, validator) {
        $scope.wallet = {};
        $scope.alert = new NcAlert();
        $scope.formData = {};

        AccountService.getProfile().then(function (profile) {
            UserProfile.set(profile.data);
            $scope.formData.bank = profile.data.influencer.bank;
            $scope.formData.accountNumber = profile.data.influencer.accountNumber;
            $scope.formData.accountName = profile.data.influencer.accountName;
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

    }])
    .controller('InfluencerCampaignDetailController', function ($scope, $state, $stateParams, CampaignService, NcAlert, AccountService, $uibModal, DataService) {
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

        CampaignService.getOne($stateParams.campaignId)
            .then(function (campaignResponse) {
                $scope.campaignNee = campaignResponse.data;
                $scope.isApply = $scope.campaignNee.isApply;
                $scope.proposal = $scope.campaignNee.proposal;
            })
            .catch(function (err) {
                $scope.alert.danger(err.data.message);
            });
    })
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
    ])
    .controller('InfluencerProfileController', ['$scope', '$window', '$stateParams', 'AccountService', 'NcAlert', 'UserProfile', 'validator', 'util',
        function ($scope, $window, $stateParams, AccountService, NcAlert, UserProfile, validator, util) {
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
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        }
    ])
    .controller('InfluencerInboxController', ['$scope', '$filter', '$stateParams', 'ProposalService', 'moment', function ($scope, $filter, $stateParams, ProposalService, moment) {
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

    }])
    .controller('PublicCampaignController', function ($scope,$stateParams, PublicService) {
        $scope.campaignNee = null;
        PublicService.getCampaign($stateParams.campaignId).then(function(x){
            $scope.campaignNee = x.data;
        });
    });

angular.module('reachRabbitApp.brand.controller', ['reachRabbitApp.service'])
    .controller('CampaignListController', ['$scope', 'CampaignService', 'DataService', 'ExampleCampaigns', function ($scope, CampaignService, DataService, ExampleCampaigns) {
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
    }])
    .controller('CampaignExampleController', ['$scope', '$stateParams', 'ExampleCampaigns', function ($scope, $stateParams, ExampleCampaigns) {
        $scope.exampleCampaign = ExampleCampaigns[$stateParams.exampleId];
    }])
    .controller('CampaignDetailController', ['$scope', '$rootScope', '$stateParams', 'CampaignService', 'DataService', '$filter', 'UserProfile', '$uibModal', 'NcAlert', 'validator', '$state', 'util',
        function ($scope, $rootScope, $stateParams, CampaignService, DataService, $filter, UserProfile, $uibModal, NcAlert, validator, $state, util) {
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
    ])
    .controller('CampaignDashboardController', ['$scope', '$rootScope', '$stateParams', 'CampaignService', 'DataService', '$filter', 'UserProfile', '$uibModal', 'NcAlert', 'validator', '$state', 'util',
        function ($scope, $rootScope, $stateParams, CampaignService, DataService, $filter, UserProfile, $uibModal, NcAlert, validator, $state, util) {
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
                sumEngagement += obj.media[k].sumEngagement;
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
    ])
    .controller('BrandProfileController', ['$scope', '$window', 'AccountService', 'NcAlert', 'UserProfile', 'validator', 'util', function ($scope, $window, AccountService, NcAlert, UserProfile, validator, util) {
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
    }])
    .controller('BrandInboxController', ['$scope', '$filter', '$rootScope', 'ProposalService', 'CampaignService', 'moment', '$stateParams', function ($scope, $filter, $rootScope, ProposalService, CampaignService, moment, $stateParams) {
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

    }])
    .controller('CartController', ['$scope', '$rootScope', '$state', 'NcAlert', 'BrandAccountService', 'ProposalService', 'TransactionService', '$stateParams', function ($scope, $rootScope, $state, NcAlert, BrandAccountService, ProposalService, TransactionService, $stateParams) {
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

    }])
    ;


angular.module('reachRabbitApp.portal.controller', ['reachRabbitApp.service'])
    .controller('BrandSigninController', ['$scope', '$rootScope', '$location', 'AccountService', 'UserProfile', '$window', 'NcAlert', function ($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
        var u = UserProfile.get();
        $scope.formData = {};
        $window.localStorage.removeItem('token');
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
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());

                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal.html#/brand-login");
                    var bounce = '/brand.html#/brand-campaign-list';
                    if ($location.search().bounce_route) {
                        bounce = ('/brand.html#' + $location.search().bounce_route);
                    }
                    $window.location.href = bounce;

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

                    var bounce = '/admin.html#/admin-transaction-history';
                    if ($location.search().bounce_route) {
                        bounce = ('/admin.html#' + $location.search().bounce_route);
                    }
                    $window.location.href = bounce;
                    // $location.path('/brand.html#/brand-campaign-list')
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
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
                    $window.localStorage.profile = JSON.stringify(profileResp.data);
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());
                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal.html#/influencer-portal");
                    var bounce = '/influencer.html#/influencer-campaign-list';
                    if ($location.search().bounce_route) {
                        bounce = '/influencer.html#' + $location.search().bounce_route;
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
                                var bounce = '/influencer.html#/influencer-campaign-list';
                                if ($location.search().bounce_route) {
                                    bounce = '/influencer.html#' + $location.search().bounce_route;
                                }
                                $window.location.href = bounce;
                            });
                    } else {
                        if (mediaId == 'facebook') {
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
    .controller('InfluencerPortalController', function ($scope, $rootScope, NcAlert, $location, $auth, $state, $stateParams, AccountService, UserProfile, $window, BusinessConfig) {
            $scope.alert = new NcAlert();
            $scope.minFollower = BusinessConfig.MIN_FOLLOWER_COUNT;
            
            $scope.ref = $location.search().ref;

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
                                    var bounce = '/influencer.html#/influencer-campaign-list';
                                    if ($location.search().bounce_route) {
                                        bounce = '/influencer.html#' + $location.search().bounce_route;
                                    }
                                    $window.location.href = bounce;
                                });
                        } else {
                            if (mediaId == 'facebook') {
                                $state.go('influencer-signup-select-page', { authData: response.data, ref: $scope.ref });
                            } else {
                                if (response.data.pages[0].count < $scope.minFollower) {
                                    $scope.minFollowerError = true;
                                    return;
                                }

                                $state.go('influencer-signup-confirmation', { authData: response.data, ref: $scope.ref });
                            }
                        }



                    });
            };
        }
    )
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
    .controller('InfluencerSignUpEmailController', function ($scope, $location, $rootScope, NcAlert, $auth, $state, $stateParams, InfluencerAccountService, AccountService, UserProfile, $window, ResourceService, BusinessConfig, validator, util) {
            $scope.alert = new NcAlert();
            $scope.formData = {};
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
                    $rootScope.setUnauthorizedRoute("/portal.html#/influencer-login");
                    UserProfile.set(profileResp.data);
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());
                    $scope.form.$setPristine();
                    //Redirect change app
                    $window.location.href = '/influencer.html#/influencer-profile-published?showToolbar';
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
            if(ref){
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
                        $rootScope.setUnauthorizedRoute("/portal.html#/influencer-portal");
                        UserProfile.set(profileResp.data);
                        //Tell raven about the user
                        Raven.setUserContext(UserProfile.get());
                        $scope.form.$setPristine();
                        //Redirect change app
                        $window.location.href = '/influencer.html#/influencer-profile-published?showToolbar';
                    })
                    .catch(function (err) {
                        $scope.alert.danger(err.data.message);
                    });
            };
        }
    )
    .controller('BrandSignupController', function ($scope, $location, $state, $rootScope, BrandAccountService, AccountService, UserProfile, $location, $window, NcAlert, util) {

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
);

/*/////////////// /////////////// /////////////// /////////////// //////////////*/
angular.module('reachRabbitApp.admin.controller', ['reachRabbitApp.service'])
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
    .controller('AdminCampaignDetailController', ['$scope', '$state', '$location', '$stateParams', 'CampaignService', 'NcAlert', 'AccountService',
        function ($scope, $state, $location, $stateParams, CampaignService, NcAlert, AccountService) {
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
                    $scope.url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/public.html#/public-campaign-detail/' + $scope.campaignNee.publicCode;
                })
                .catch(function (err) {
                    $scope.alert.danger(err.data.message);
                });
        }
    ])
    .controller('AdminCampaignListController', ['$scope', 'CampaignService', function ($scope, CampaignService) {

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
    }])
    .controller('AdminInboxController', ['$scope', '$filter', '$rootScope', 'ProposalService', 'CampaignService', 'moment', '$stateParams', function ($scope, $filter, $rootScope, ProposalService, CampaignService, moment, $stateParams) {
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
    }])
    .controller('AdminWorkroomController', ['$scope', 'UserProfile', '$uibModal', '$interval', '$rootScope', '$stateParams', 'ProposalService', 'NcAlert', '$state', '$location', '$window', 'util', 'LongPollingService', '$timeout', 'InfluencerAccountService',
        function ($scope, UserProfile, $uibModal, $interval, $rootScope, $stateParams, ProposalService, NcAlert, $state, $location, $window, util, LongPollingService, $timeout, InfluencerAccountService) {
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
    ]);
