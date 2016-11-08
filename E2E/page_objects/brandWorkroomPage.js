var brandWorkroomPage = function() {
	this.items = element.all(by.repeater('x in msglist'));
	this.messageTextarea = element(by.model('formData.messageStr'));
	this.submitBtn = element(by.id('brand-workroom-submit-btn'));
};

module.exports = new brandWorkroomPage();