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
    .controller('EmptyController', ['$scope', '$uibModal', function($scope, $uibModal) {
        $scope.testHit = function() {
            var scope = $scope;
            // console.log("Test World");
        };
    }])
    .controller('ProposalModalController', ['$scope', 'DataService', 'CampaignService', 'ProposalService', 'campaign', '$state', 'NcAlert', '$uibModalInstance', '$rootScope', 'proposal',
        function($scope, DataService, CampaignService, ProposalService, campaign, $state, NcAlert, $uibModalInstance, $rootScope, proposal) {
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

            if($scope.isEditMode){
                proposal.media.forEach(function(infm){
                    console.log(infm);
                    $scope.selectedMedia[infm.mediaId] = true;
                });
                $scope.formData = proposal;
                //Selected Media Theorem
            }

            /*
             *  Check if profile has linked media id
             */
            $scope.profileHasMedia = function(mediaId) {
                // console.log($rootScope.getProfile().influencer.influencerMedias);
                return _.findIndex($rootScope.getProfile().influencer.influencerMedias, function(e) {
                    return _.get(e, 'media.mediaId') === mediaId;
                }) >= 0;
            };

            $scope.$watch('selectedMedia', function(selectedMedia) {
                $scope.formData.media = [];
                /*
                 * loop over selected media key
                 */
                Object.keys(selectedMedia).forEach(function(smk) {
                    //smk = selected media key
                    if (!selectedMedia[smk]) return;
                    $scope.formData.media.push({
                        mediaId: smk
                    });
                });

            }, true);

            $scope.submit = function(formData) {
                var action = CampaignService.sendProposal;
                if(formData.proposalId){
                   action = ProposalService.update;
                }else{
                   action = CampaignService.sendProposal;
                }

                action(formData, campaign.campaignId)
                .then(function(doneR) {
                        return $uibModalInstance.close(doneR.data);
                    })
                    .catch(function(err) {
                        $scope.alert.danger(err.data.message);
                    });
               
            };

            $scope.$watch('formData.price', function(pp) {
                $scope.proposalNetPrice = Number(pp) * 0.820;
            });

            DataService.getMedium().then(function(response) {
                $scope.medium = response.data;
            });

            DataService.getCompletionTime().then(function(response) {
                $scope.completionTimes = response.data;
            });
        }
    ]);

/////////////// /////////////// /////////////// /////////////// ///////////////
/*
    INFLUENCER
*/
/////////////// /////////////// /////////////// /////////////// ///////////////

angular.module('myApp.influencer.controller', ['myApp.service'])
    .controller('WorkroomController', ['$scope', '$uibModal', '$interval', '$stateParams', 'ProposalService', 'NcAlert','$state', '$location',
        function($scope, $uibModal, $interval, $stateParams, ProposalService, NcAlert, $state, $location) {
            $scope.msglist = [];
            $scope.msgLimit = 30;
            $scope.totalElements = 0;

            //Select Proposal
            $scope.selectProposal = function(){
                
            };

            //Edit Proposal
            $scope.editProposal = function() {
                //popup a modal
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/templates/influencer-proposal-modal.html',
                    controller: 'ProposalModalController',
                    size: 'md',
                    resolve: {
                        campaign: function() {
                            return $scope.proposal.campaign;
                        },
                        proposal: function(){
                            return $scope.proposal;
                        }
                    }
                });

                //on user close
                modalInstance.result.then(function(proposal) {
                    if (!proposal || !proposal.proposalId) {
                        return;
                    }
                    // $location.reload();
                    window.location.reload();
                    // $state.go('influencer-workroom', { proposalId: proposal.proposalId });
                });
            };

            function scrollBottom() {
                $(".message-area").delay(10).animate({ scrollTop: 500 }, '1000', function() {});
            }

            $scope.proposalId = $stateParams.proposalId;
            ProposalService.getMessages($scope.proposalId, {
                sort: ['createdAt,desc'],
                size: $scope.msgLimit
            }).then(function(res) {
                $scope.totalElements = res.data.totalElements;
                $scope.msglist = res.data.content.reverse();
                $scope.poll();
                //scrollBottom();
            });

            $scope.hasPastMessage = function() {
                return $scope.totalElements > $scope.msglist.length;
            };

            $scope.loadPastMessage = function() {
                ProposalService.getMessages($scope.proposalId, {
                        sort: ['createdAt,desc'],
                        size: $scope.msgLimit,
                        timestamp: $scope.msglist[0].createdAt
                    })
                    .then(function(res) {
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

            $scope.poll = function() {
                ProposalService.getMessagesPoll($scope.proposalId, {
                        timestamp: $scope.msglist.length > 0 ? $scope.msglist[$scope.msglist.length - 1].createdAt : new Date()
                    })
                    .then(function(res) {
                        $scope.totalElements += res.data.length;
                        for (var i = res.data.length - 1; i >= 0; i--) {
                            if ($scope.msglist.length >= $scope.msgLimit) {
                                $scope.msglist.shift();
                            }
                            $scope.msglist.push(res.data[i]);
                        }
                    })
                    .finally(function() {
                        if (!stop) {
                            $scope.poll();
                        }
                    });
            };

            $scope.$on('$destroy', function() {
                stop = true;
            });

            $scope.formData = {
                resources: []
            };
            $scope.alert = new NcAlert();
            $scope.sendMessage = function(messageStr, attachments) {
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
                    .then(function(resp) {
                        //$scope.msglist.push(resp.data);
                        $scope.formData = {
                            resources: []
                        };
                        //scrollBottom();
                    })
                    .catch(function(err) {
                        $scope.alert.danger(err.message);
                    });
            };

            $scope.proposal = null;

            ProposalService.getOne($scope.proposalId)
                .then(function(proposalResponse) {
                    $scope.proposal = proposalResponse.data;
                });

            /* JS for Chat Area */
            setChatArea();

            $(window).resize(function() {
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
    .controller('InfluencerCampaignDetailController', ['$scope', '$state', '$stateParams', 'CampaignService', 'NcAlert', 'AccountService', '$uibModal', 'DataService',
        function($scope, $state, $stateParams, CampaignService, NcAlert, AccountService, $uibModal, DataService) {
            $scope.campaignNee = null;
            $scope.alert = new NcAlert();
            $scope.keywordMap = function(arr) {
                if (!arr) return [];
                return arr.map(function(k) {
                    return k.keyword;
                });
            };

            $scope.sendProposal = function() {
                //popup a modal
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/templates/influencer-proposal-modal.html',
                    controller: 'ProposalModalController',
                    size: 'md',
                    resolve: {
                        campaign: function() {
                            return $scope.campaignNee;
                        },
                        proposal: function(){
                            return false;
                        }
                    }
                });

                //on user close
                modalInstance.result.then(function(proposal) {
                    if (!proposal || !proposal.proposalId) {
                        return;
                    }
                    $state.go('influencer-workroom', { proposalId: proposal.proposalId });
                });
            };
            CampaignService.getOne($stateParams.campaignId)
                .then(function(campaignResponse) {
                    $scope.campaignNee = campaignResponse.data;
                    return AccountService.getUser($scope.campaignNee.brandId);
                })
                .then(function(brandUserDataResponse) {
                    $scope.brandUserInfo = brandUserDataResponse.data;
                })
                .catch(function(err) {
                    $scope.alert.danger(err.data.message);
                });


        }
    ])
    .controller('InfluencerCampaignListController', ['$scope', '$state', 'CampaignService', 'DataService', 'ExampleCampaigns', '$rootScope',
        function($scope, $state, CampaignService, DataService, ExampleCampaigns, $rootScope) {
            $scope.handleUserClickThumbnail = function(c) {
                $state.go('influencer-campaign-detail-open', {
                    campaignId: c.campaignId
                });
            };
            $scope.$watch('filter', function() {
                $scope.load(_.extend($scope.params, { mediaId: $scope.filter }));
            });

            //Load campaign data
            $scope.load = function(data) {
                $scope.params = data;
                CampaignService.getOpenCampaigns(data).then(function(response) {
                    $scope.campaigns = response.data;
                });
            };
            //Init
            $scope.load();

            //Init media data
            DataService.getMedium()
                .then(function(response) {
                    $scope.filters = _.map(response.data, function(e) {
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
    .controller('InfluencerProfileController', ['$scope', '$window', 'AccountService', 'NcAlert', 'UserProfile',
        function($scope, $window, AccountService, NcAlert, UserProfile) {
            $scope.formData = {};
            $scope.alert = new NcAlert();
            $scope.saveProfile = function(profile) {
                AccountService.saveProfile(profile)
                    .then(function(response) {
                        // delete response.data.password;
                        // $scope.formData = response.data;
                        //set back to localstorage
                        UserProfile.set(response.data);

                        $scope.success = true;
                        $scope.alert.success('บันทึกข้อมูลเรียบร้อย!');
                    })
                    .catch(function(err) {
                        $scope.alert.danger(err.data.message);
                    });
            };

            $scope.linkDone = function() {
                $scope.saveProfile($scope.formData);
            };

            AccountService.getProfile()
                .then(function(response) {
                    $scope.formData = response.data;
                    $scope.formData.influencer.categories = $scope.formData.influencer.categories || [];

                    _.forEach($scope.formData.influencer.categories, function(r) {
                        r._selected = true;
                    });
                    delete $scope.formData.password;
                })
                .catch(function(err) {
                    $scope.alert.danger(err.data.message);
                });

        }
    ])
    .controller('InfluencerInboxController', ['$scope', '$filter', 'ProposalService', 'moment', function($scope, $filter, ProposalService, moment) {
        $scope.statusCounts = {};
        $scope.load = function(params) {
            $scope.params = params;
            ProposalService.getAll(params)
                .then(function(response) {
                    $scope.proposals = response.data;
                    _.forEach($scope.proposals.content, function(proposal) {
                      ProposalService.countUnreadMessages(proposal.proposalId)
                        .then(function(res) {
                          proposal.unread = res.data;
                        });
                    });
                });
            ProposalService.getActive()
                .then(function(response) {
                    $scope.filters = _.map(response.data, function(e) {
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
        $scope.loadProposalCounts = function() {
          //Selection status
          ProposalService.count({
            status: 'Selection'
          }).then(function(res) {
            $scope.statusCounts.selection = res.data;
          });
          //Working status
          ProposalService.count({
            status: 'Working'
          }).then(function(res) {
            $scope.statusCounts.working = res.data;
          });
          //Complete status
          ProposalService.count({
            status: 'Complete'
          }).then(function(res) {
            $scope.statusCounts.complete = res.data;
          });
        };
        $scope.lastMessageUpdated = function(proposal) {
            if (moment(proposal.messageUpdatedAt).isBefore(moment().endOf('day').subtract(1, 'days'))) {
                return $filter('amDateFormat')(proposal.messageUpdatedAt, 'll');
            }
            return $filter('amCalendar')(proposal.messageUpdatedAt);
        };
        $scope.$watch('filter', function() {
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
    .controller('InfluencerBrandProfile', ['$scope', 'AccountService', '$stateParams', function($scope, AccountService, $stateParams){
        AccountService.getProfile($stateParams.brandId)
        .then(function(response){
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
    .controller('CampaignListController', ['$scope', 'CampaignService', 'DataService', 'ExampleCampaigns', function($scope, CampaignService, DataService, ExampleCampaigns) {
        $scope.testHit = function() {
            var scope = $scope;
            console.log("Test World");
        };

        $scope.myCampaign = [];
        $scope.$watch('filter', function() {
            $scope.load(_.extend($scope.params, { mediaId: $scope.filter }));
        });

        //Load campaign data
        $scope.load = function(data) {
            $scope.params = data;
            CampaignService.getAll(data).then(function(response) {
                $scope.myCampaign = response.data;
            });
        };
        //Init
        $scope.load();

        //Example campaign section
        $scope.exampleCampaign = ExampleCampaigns;
    }])
    .controller('CampaignExampleController', ['$scope', '$stateParams', 'ExampleCampaigns', function($scope, $stateParams, ExampleCampaigns) {
        $scope.exampleCampaign = ExampleCampaigns[$stateParams.exampleId];
    }])
    .controller('CampaignDetailController', ['$scope', '$stateParams', 'CampaignService', 'DataService', '$filter', 'UserProfile', 'NcAlert',
        function($scope, $stateParams, CampaignService, DataService, $filter, UserProfile, NcAlert) {
            //initial form data
            $scope.alert = new NcAlert();

            $scope.resources = [];
            $scope.formData = {
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

            $scope.budget = null;

            $scope.budgetDisplayAs = function(budgetObject) {
                return $filter('number')(budgetObject.fromBudget) + " - " + $filter('number')(budgetObject.toBudget);
            };

            //Fetch initial datasets
            DataService.getMedium()
                .then(function(response) {
                    $scope.medium = response.data;
                    $scope.medium.forEach(function(item) {
                        $scope.mediaObjectDict[item.mediaId] = item;
                    });
                });
            DataService.getCategories()
                .then(function(response) {
                    $scope.categories = response.data;
                });

            $scope.$watch('mediaBooleanDict', function() {
                $scope.formData.media = [];
                //tell server which media are checked
                _.forEach($scope.mediaBooleanDict, function(value, key) {
                    if (value === true) {
                        $scope.formData.media.push($scope.mediaObjectDict[key]);
                    }
                });

            }, true);

            $scope.$watch('budget.id', function() {
                if ($scope.budget) {
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
                    .then(function(response) {
                        //overrides the form data
                        $scope.formData = angular.copy(response.data);
                        //Tell checkbox which media are in the array
                        ($scope.formData.media || []).forEach(function(item) {
                            $scope.mediaBooleanDict[item.mediaId] = true;
                        });
                        //Tell dropdown which budget is matching the budget object
                        $scope.budget = _.find($scope.budgets, function(probe) {
                            return Number(probe.fromBudget) === Number($scope.formData.fromBudget) &&
                                Number(probe.toBudget) === Number($scope.formData.toBudget);
                        });
                        //Split resources array into two parts
                        $scope.formData.resources = [];

                        if (response.data.resources && response.data.resources.length > 0) {
                            $scope.formData.resources.push(response.data.resources.shift());
                            $scope.resources = angular.copy(response.data.resources); //the rest
                        }

                        // console.log($scope.formData);

                        //ensure non null
                        $scope.formData.keywords = $scope.formData.keywords || [];

                        $scope.formData.brand = UserProfile.get().brand;
                        $scope.createMode = false;
                    });
            } else {
                $scope.createMode = true;
            }

            $scope.isInvalidMedia = function() {
                return $scope.formData.media.length === 0 && $scope.form.$submitted && $scope.formData.status == 'Open';
            };
            $scope.isPublishing = function() {
                return $scope.formData.status === 'Open';
            };

            $scope.save = function(formData, mediaBooleanDict, mediaObjectDict, status) {
                $scope.formData.brand = UserProfile.get().brand;
                $scope.formData.status = status;
                $scope.formData.resources = $scope.formData.resources.concat($scope.resources || []);

                //check for publish case
                if (status == 'Open') {
                    if (!$scope.form.$valid || $scope.formData.media.length === 0) {
                        $scope.form.$setSubmitted();
                        $scope.alert.danger('กรุณากรอกข้อมูลให้ถูกต้องให้ถูกต้องและครบถ้วน');
                        return;
                    }
                }

                //saving
                CampaignService.save(formData)
                    .then(function(echoresponse) {
                        $scope.formData = echoresponse.data;

                        if (echoresponse.data.status == "Draft") {
                            $scope.alert.success('บันทึกข้อมูลเรียบร้อยแล้ว!');
                        } else if (echoresponse.data.status == 'Open') {
                            $scope.alert.success('ลงประกาศสำเร็จ! แต่ใจเย็นสิ ยังไม่ได้ทำ Flow นี้เฟร้ย!');
                        } else {
                            throw new Error("Weird status");
                        }
                    })
                    .catch(function(err) {
                        $scope.alert.danger(err.data.message);
                    });

            };

        }
    ])
    .controller('BrandProfileController', ['$scope', '$window', 'AccountService', 'NcAlert', 'UserProfile', function($scope, $window, AccountService, NcAlert, UserProfile) {
        $scope.formData = {};
        $scope.alert = new NcAlert();
        AccountService.getProfile()
            .then(function(response) {
                $scope.formData = response.data;
                delete $scope.formData.password;
            })
            .catch(function(err) {
                $scope.alert.danger(err.data.message);
            });

        $scope.saveProfile = function(form, profile) {
            $scope.form.$setSubmitted();
            if (!$scope.form.$valid) {
                $scope.alert.danger('กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน');
                return;
            }
            AccountService.saveProfile(profile)
                .then(function(response) {
                    delete response.data.password;
                    $scope.formData = response.data;
                    //set back to localstorage
                    UserProfile.set(response.data);

                    $scope.success = true;
                    $scope.alert.success('บันทึกข้อมูลเรียบร้อย!');
                })
                .catch(function(err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('BrandInboxController', ['$scope', '$filter', 'ProposalService', 'CampaignService', 'moment', function($scope, $filter, ProposalService, CampaignService, moment) {
        $scope.statusCounts = {};
        $scope.load = function(params) {
            $scope.params = params;
            ProposalService.getAll(params)
                .then(function(response) {
                    $scope.proposals = response.data;
                    _.forEach($scope.proposals.content, function(proposal) {
                      ProposalService.countUnreadMessages(proposal.proposalId)
                        .then(function(res) {
                          proposal.unread = res.data;
                        });
                    });
                });
            CampaignService.getActiveCampaigns()
                .then(function(response) {
                    $scope.filters = _.map(response.data, function(e) {
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
        $scope.loadProposalCounts = function() {
          //Selection status
          ProposalService.count({
            status: 'Selection'
          }).then(function(res) {
            $scope.statusCounts.selection = res.data;
          });
          //Working status
          ProposalService.count({
            status: 'Working'
          }).then(function(res) {
            $scope.statusCounts.working = res.data;
          });
          //Complete status
          ProposalService.count({
            status: 'Complete'
          }).then(function(res) {
            $scope.statusCounts.complete = res.data;
          });
        };
        $scope.lastMessageUpdated = function(proposal) {
            if (moment(proposal.messageUpdatedAt).isBefore(moment().endOf('day').subtract(1, 'days'))) {
                return $filter('amDateFormat')(proposal.messageUpdatedAt, 'll');
            }
            return $filter('amCalendar')(proposal.messageUpdatedAt);
        };
        $scope.$watch('filter', function() {
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
    .controller('BrandInfluencerProfile', ['$scope', 'NcAlert', 'AccountService', '$stateParams', function($scope, NcAlert, AccountService, $stateParams){
        $scope.alert = new NcAlert();
        AccountService.getProfile($stateParams.influencerId)
        .then(function(response){
            $scope.influencer = response.data;
        });
        
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
    .controller('BrandSigninController', ['$scope', '$rootScope', '$location', 'AccountService', 'UserProfile', '$window', 'NcAlert', function($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
        var u = UserProfile.get();

        $scope.formData = {};

        if(_.get(u, 'influencer')){
            $window.location.href = "/influencer.html#/influencer-campaign-list";
            return;
        }

        if(_.get(u, 'brand')){
            $window.location.href = "/brand.html#/brand-campaign-list";
            return;
        }

        $scope.formData = {};

        $scope.$watch('formData.username', function(e) {
            console.log($scope.formData);
        }, true);
        $window.localStorage.removeItem('token');
        $scope.messageCode = $location.search().message;
        $scope.alert = new NcAlert();

        if ($scope.messageCode == "401") {
            $scope.alert.warning("<strong>401</strong> Unauthorized or Session Expired");
        }

        $scope.login = function() {
            $location.search('message', 'nop');
            AccountService.getToken($scope.formData.username, $scope.formData.password)
                .then(function(response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function(profileResp) {
                    UserProfile.set(profileResp.data);
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());
                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal.html#/brand-login");
                    $window.location.href = '/brand.html#/brand-campaign-list';
                })
                .catch(function(err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('InfluencerSigninController', ['$scope', '$rootScope', '$location', 'AccountService', 'UserProfile', '$window', 'NcAlert', function($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
        $scope.formData = {};
        $window.localStorage.removeItem('token');
        $scope.messageCode = $location.search().message;
        $scope.alert = new NcAlert();

        if ($scope.messageCode == "401") {
            $scope.alert.warning("<strong>401</strong> Unauthorized or Session Expired");
        }

        $scope.login = function(username, password) {
            $location.search('message', 'nop');
            AccountService.getTokenInfluencer(username, password)
                .then(function(response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function(profileResp) {
                    $window.localStorage.profile = JSON.stringify(profileResp.data);
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());
                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal.html#/influencer-portal");
                    $window.location.href = '/influencer.html#/influencer-campaign-list';
                })
                .catch(function(err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('InfluencerJesusController', ['$scope', '$rootScope', '$location', 'AccountService', 'UserProfile', '$window', 'NcAlert', function($scope, $rootScope, $location, AccountService, UserProfile, $window, NcAlert) {
        //For influencer gods
        $scope.login = function(username, password) {
            $location.search('message', 'nop');
            AccountService.getTokenInfluencer(username, password)
                .then(function(response) {
                    var token = response.data.token;
                    $window.localStorage.token = token;
                    return AccountService.getProfile();
                })
                .then(function(profileResp) {
                    UserProfile.set(profileResp.data);
                    //Tell raven about the user
                    Raven.setUserContext(UserProfile.get());
                    //Redirect
                    $rootScope.setUnauthorizedRoute("/portal.html#/influencer-login");
                    $window.location.href = '/influencer.html#/influencer-campaign-list';
                })
                .catch(function(err) {
                    $scope.alert.danger(err.data.message);
                });
        };
    }])
    .controller('InfluencerPortalController', ['$scope', '$rootScope', 'NcAlert', '$auth', '$state', '$stateParams', 'AccountService', 'UserProfile', '$window', 'BusinessConfig',
        function($scope, $rootScope, NcAlert, $auth, $state, $stateParams, AccountService, UserProfile, $window, BusinessConfig) {
            $scope.alert = new NcAlert();
            $scope.minFollower = BusinessConfig.MIN_FOLLOWER_COUNT;

            if ($stateParams.alert) {
                $scope.alert[$stateParams.alert.type]($stateParams.alert.message);
            }

            $scope.startAuthFlow = function(mediaId) {
                $window.localStorage.clear();
                $auth.authenticate(mediaId)
                    .then(function(response) {
                        // console.log('Response', response.data);
                        if (response.data.token) {
                            $rootScope.setUnauthorizedRoute("/portal.html#/influencer-portal");

                            $window.localStorage.token = response.data.token;
                            AccountService.getProfile()
                                .then(function(profileResp) {
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
                                $state.go('influencer-signup-confirmation', { authData: response.data });
                            }
                        }



                    });
            };

        }
    ])
    .controller('InfluencerFacebookPageSelectionController', ['$scope', 'NcAlert', '$auth', '$state', '$stateParams', 'InfluencerAccountService', 'BusinessConfig', function($scope, NcAlert, $auth, $state, $stateParams, InfluencerAccountService, BusinessConfig) {
        var authData = $stateParams.authData;
        $scope.pages = authData.pages;
        $scope.formData = {
            selectedPage: null
        };
        $scope.minFollower = BusinessConfig.MIN_FOLLOWER_COUNT;
        $scope.choosePage = function(page) {
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
    .controller('InfluencerSignUpController', ['$scope', '$rootScope', 'NcAlert', '$auth', '$state', '$stateParams', 'InfluencerAccountService', 'AccountService', 'UserProfile', '$window', 'ResourceService', 'BusinessConfig',
        function($scope, $rootScope, NcAlert, $auth, $state, $stateParams, InfluencerAccountService, AccountService, UserProfile, $window, ResourceService, BusinessConfig) {

            var profile = $stateParams.authData;
            $scope.alert = new NcAlert();

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
                .then(function(resource) {
                    $scope.profilePictureResource = resource.data;
                });


            $scope.register = function() {
                InfluencerAccountService.signup({
                        name: $scope.formData.name,
                        email: $scope.formData.email,
                        phoneNumber: $scope.formData.phoneNumber,
                        influencer: {
                            influencerMedias: [{
                                media: $scope.formData.media,
                                socialId: $scope.formData.id,
                                followerCount: $scope.formData.pages[0].count,
                                pageId: $scope.formData.pageId || null
                            }]
                        },
                        profilePicture: $scope.profilePictureResource
                    })
                    .then(function(response) {
                        var token = response.data.token;
                        $window.localStorage.token = token;
                        return AccountService.getProfile();
                    })
                    .then(function(profileResp) {
                        $rootScope.setUnauthorizedRoute("/portal.html#/influencer-portal");
                        UserProfile.set(profileResp.data);
                        //Tell raven about the user
                        Raven.setUserContext(UserProfile.get());
                        //Redirect change app
                        $window.location.href = '/influencer.html#/influencer-campaign-list';
                    })
                    .catch(function(err) {
                        $scope.alert.danger(err.data.message);
                    });
            };
        }
    ])
    .controller('BrandSignupController', ['$scope', '$rootScope', 'BrandAccountService', 'AccountService', 'UserProfile', '$location', '$window', 'NcAlert',
        function($scope, $rootScope, BrandAccountService, AccountService, UserProfile, $location, $window, NcAlert) {

            $scope.formData = {};

            $scope.alert = new NcAlert();

            $scope.submit = function(brand) {
                if (!$scope.form.$valid) {
                    $scope.alert.danger('กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน');
                    return;
                }
                $window.localStorage.clear();
                BrandAccountService.signup(brand)
                    .then(function(response) {
                        var token = response.data.token;
                        $window.localStorage.token = token;
                        return AccountService.getProfile();
                    })
                    .then(function(profileResp) {
                        UserProfile.set(profileResp.data);
                        //Tell raven about the user
                        Raven.setUserContext(UserProfile.get());
                        //Redirect
                        $rootScope.setUnauthorizedRoute("/portal.html#/brand-login");
                        $window.location.href = '/brand.html#/brand-campaign-list';
                    })
                    .catch(function(err) {
                        $scope.alert.danger(err.data.message);
                    });
            };

        }
    ]);
