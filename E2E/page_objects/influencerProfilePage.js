var influencerProfilePage = function () {
    'use strict';
    this.name = element(by.model("formData.name"));
    this.about = element(by.model('formData.influencer.about'));
    this.phone = element(by.model('formData.phoneNumber'))
    this.vertifiedName = element(by.model('formData.influencer.fullname'));
    this.vertifiedAddress = element(by.model('formData.influencer.address'));
    this.vertifiedCardNumber = element(by.model('formData.influencer.idCardNumber'));
    this.uploader = element(by.css('input[type="file"]'));
    this.submit_btn = element(by.css('.btn-primary'));
    this.doneCropperBtn = element(by.css('.done-crop-btn'));
    this.thumbImage = element(by.css('.input-upload-image img'));
};
module.exports = new influencerProfilePage();