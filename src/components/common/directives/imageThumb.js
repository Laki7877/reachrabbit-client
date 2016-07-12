/**
 * Image Thumbnail with uploader
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
    .directive('imageThumb', function ($uploader) {
        return {
            restrict: 'AE',
            scope: {
              width: '=',
              height: '=',
              model: '=ngModel',
              accessor: '&?'  //function that defines how to access the url of the model
            },
            templateUrl: 'templates/image-thumb.html',
            link: function (scope, elem, attrs, form) {
              var noImage = 'http://orig03.deviantart.net/561f/f/2014/315/9/c/'+
              'rabbit_doubt_mask_avatar_for_facebook_by_facebookavatars-d8622bz.png';

              if(!scope.accessor){
                scope.accessor = function(data){
                  if(!scope.model) return noImage;
                  return data.url;
                }
              }

              scope.loadingImage = false;
              scope.upload = function(file) {
                scope.loadingImage = true;
                $uploader.upload('/file', file)
                .then(function(data) {
                  scope.loadingImage = false;
                  scope.model = data;
                });
              };


            }
        }
    });
