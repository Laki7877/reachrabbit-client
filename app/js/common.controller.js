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
require('./common.service');

angular.module('reachRabbitApp.common.controller', ['reachRabbitApp.common.service'])
    .controller('EmptyController', ['$scope', '$uibModal', function ($scope, $uibModal) {
        $scope.testHit = function () {
            var scope = $scope;
            // console.log("Test World");
        };
    }])
    .controller('TransactionDetailController', function ($scope, NcAlert, $stateParams, TransactionService, AdminService) {
        var cartId = $stateParams.cartId;
        $scope.alert = new NcAlert();

        var loadData = function () {
            TransactionService.getByCart(cartId)
                .then(function (transaction) {
                    $scope.transaction = transaction.data;

                    if ($scope.isExpired()) {
                        $scope.alert.warning("การสั่งซื้อนี้ได้หมดอายุลงแล้ว");
                    }
                    _.forEach($scope.transaction.brandTransactionDocument, function (document) {
                        if (document.type == 'Base') {
                            $scope.baseDocument = document;
                        } else if (document.type == 'Tax') {
                            $scope.taxDocument = document;
                        }
                    });
                    console.log($scope.baseDocument, $scope.taxDocument);
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
    })
    .controller('ProposalModalController', function ($scope, DataService, CampaignService, ProposalService, campaign, $state, NcAlert, $uibModalInstance, $rootScope, proposal, validator, util, BusinessConfig, UserProfile) {
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
            if ($scope.campaign.brand.isCompany) {
                $scope.proposalNetPrice = (Number(pp) * (1 - (UserProfile.get().influencer.commission / 100) )) - (Number(pp) * BusinessConfig.BRAND_TAX_FEE);
            } else {
                $scope.proposalNetPrice = Number(pp) * (1 - (UserProfile.get().influencer.commission / 100));
            }

        });

        DataService.getMedium().then(function (response) {
            $scope.medium = response.data;
        });

        DataService.getCompletionTime().then(function (response) {
            $scope.completionTimes = response.data;
        });
    }
    )
    .controller('WorkroomController', function ($scope, UserProfile, $uibModal, $interval, $rootScope, $stateParams, ProposalService, NcAlert, $state, $location, $window, util, LongPollingService, $timeout, InfluencerAccountService) {
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

            mixpanel.track("Select Proposal", {
                proposalId: $scope.proposal.proposalId
            });

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
                        return angular.copy($scope.proposal.campaign);
                    },
                    proposal: function () {
                        return angular.copy($scope.proposal);
                    }
                }
            });

            //on user close
            modalInstance.result.then(function (proposal) {
                if (!proposal || !proposal.proposalId) {
                    return;
                }

                window.location.reload();
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
            _.forEach($scope.msglist, function (e) {
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
            if (!$scope.msglist) return false;
            if ($scope.msglist.length === 0) return false;
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
                            if (res.data[i].referenceId && !_.isNil($scope.msgHash[res.data[i].referenceId])) {
                                _.extend($scope.msgHash[res.data[i].referenceId], res.data[i]);
                            } else {
                                // from server
                                $scope.msglist.push(res.data[i]);
                                $scope.msgHash[res.data[i].referenceId] = res.data[i];
                            }
                        }
                    }
                    console.log($scope.totalElements, $scope.msglist.length, res.data);
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
    )
    .controller('InfluencerProfilePortfolioController', function ($scope, NcAlert, AccountService, $stateParams) {
        $scope.formData = {};
        $scope.alert = new NcAlert();
        if ($stateParams.proposalId) {
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
    })
    .controller('BrandProfilePortfolioController', function ($scope, AccountService, $stateParams) {
        if ($stateParams.proposalId) {
            $scope.proposalId = $stateParams.proposalId;
        }
        AccountService.getProfile($stateParams.brandId)
            .then(function (response) {
                $scope.brand = response.data;
            });
    })
    .controller('PayoutHistoryController', function ($scope, $state, TransactionService) {
        //Load campaign data
        $scope.isExpired = function (T) {
            return T.expiredAt <= (new Date());
        };
        $scope.load = function (data) {
            $scope.params = data;
            TransactionService.getAll(_.extend(data, { type: 'Payout' })).then(function (response) {
                $scope.transactions = response.data;
                _.forEach($scope.transactions.content, function (item) {
                    item.proposalCount = _.filter(item.influencerTransactionDocument, function (filter) {
                        if (filter.type == "Base") {
                            return filter;
                        }
                    }).length;
                });
            });
        };
        $scope.load({
            sort: 'updatedAt,desc'
        });
    })
    .controller('PayoutDetailController', function ($scope, WalletService, AdminService, AccountService, NcAlert, $state, $stateParams, UserProfile) {
        $scope.alert = new NcAlert();
        var loadTdoc = function () {
            $scope.tDoc = [];
            WalletService.getWalletTransaction($stateParams.walletId)
                .then(function (response) {
                    $scope.payout = response.data;
                    var _base = null;
                    $scope.detail = {};
                    $scope.detail.fullname = $scope.payout.influencerTransactionDocument[0].fullname;
                    $scope.detail.address = $scope.payout.influencerTransactionDocument[0].address;
                    $scope.detail.idCardNumber = $scope.payout.influencerTransactionDocument[0].idCardNumber;
                    $scope.detail.idCard = $scope.payout.influencerTransactionDocument[0].idCard;
                    $scope.payout.influencerTransactionDocument
                        .sort(function (i, x) {
                            return i.documentId - x.documentId;
                        })
                        .forEach(function (sortedDoc) {
                            if (sortedDoc.type == "Base") {
                                var item = {
                                    title: sortedDoc.proposal.campaign.title,
                                    price: sortedDoc.amount
                                };

                                _base = item;
                                $scope.tDoc.push(item);
                            } else if (sortedDoc.type == "Fee") {
                                _base.fee = sortedDoc.amount;
                            } else if (sortedDoc.type == 'TransferFee') {
                                $scope.transferFeeDoc = sortedDoc;
                            } else if (sortedDoc.type == "Tax") {
                                _base.tax = sortedDoc.amount;
                            }
                        });
                    console.log($scope.tDoc);
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

    })
    .controller('YesNoConfirmationModalController', function ($scope, DataService, CampaignService, ProposalService, campaign, $state, NcAlert, $uibModalInstance, $rootScope, proposal) {
        $scope.yes = function () {
            $uibModalInstance.close('yes');
        };
    })
    .controller('CampaignMessageModalController', function ($scope, email, campaignId, CampaignService, $uibModalInstance) {
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
    })
    .controller('ProposalMessageModalController', function ($scope, email, proposalId, ProposalService, $uibModalInstance) {
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
    });