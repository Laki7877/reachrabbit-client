var brandProfilePage = function () {
    'use strict';
    this.about = element(by.model("formData.brand.about"));
    this.name = element(by.model("formData.brand.brandName"));
    this.website = element(by.model('formData.brand.website'));
    this.uploader = element(by.css('input[type="file"]'));
    this.submit_btn = element(by.css('.btn-primary'));
    this.doneCropperBtn = element(by.css('.done-crop-btn'));
    this.thumbImage = element(by.css('.input-upload-image img'));
};
module.exports = new brandProfilePage();