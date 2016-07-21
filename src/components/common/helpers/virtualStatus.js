
/**
 * Virtual status
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
    .factory('VirtualStatus', function ($http, $storage, $q) {
        return {
          isApplied: function(campaignObject){
            var profile = $storage.get('profile');
            var isApplied = _.find(campaignObject.campaignProposals, function(x){
              return x.influencerId === profile.influencer.influencerId
            });
            return campaignObject.status == 'open' && isApplied;
          }
        }
    });
