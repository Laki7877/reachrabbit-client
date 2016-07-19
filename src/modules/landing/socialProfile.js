/**
 * helper -
 * Some social profile loader (for influencer signup)
 * load into controller's $scope
 * Note: only apply for signup (used once)
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */

'use strict';

module.exports = function(soPro,$api, formData) {
  if (!formData.email) {
    formData.email = soPro.data.user.email;
  }

  if (!formData.profilePicture) {

    //Save as resource
    $api({
      method: 'POST',
      url: '/file/remote',
      data: {
        url: soPro.data.user.picture.url,
        mimetype: 'image/png'
      }
    }).then(function(resource) {
      formData.profilePicture = resource;
    }).catch(function(err) {
      console.log(err);
    });

  }

  formData.influencer.socialAccounts[soPro.data.modelBind.mediaId] = soPro.data.modelBind;

  if (!formData.name) {
    formData.name = soPro.data.user.name;　
  }

}
