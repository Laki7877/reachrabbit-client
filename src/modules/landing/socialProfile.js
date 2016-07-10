/**
 * Some social profile loader
 * load into controller's $scope
 * Note: only apply for signup
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */

'use strict';

module.exports = function(soPro,$api, formData) {
  formData.socialAccounts[soPro.provider] = {
    id: soPro.data.id,
    token: soPro.data.token
  };

  if (!formData.email) {
    formData.email = soPro.data.email;
  }

  if (!formData.profilePicture) {

    //Save as resource
    $api({
      method: 'POST',
      url: '/file/remote',
      data: {
        url: soPro.data.picture.url,
        mimetype: 'image/png'
      }
    }).then(function(data) {
      formData.profilePicture = data;
    }).catch(function(err) {
      console.log(err);
    });

  }

  if (!formData.name) {
    formData.name = soPro.data.name;　
  }

}
