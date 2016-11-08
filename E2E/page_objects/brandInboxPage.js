var brandInboxPage = function() {
	this.items = element.all(by.repeater('proposal in proposals.content'));
	this.firstItem = this.items.get(0);

	this.gotoWorkroom = function(indx) {
		if(!indx) {
			indx = 0;
		}
		return this.firstItem.element('.btn-workroom').click();
	};
};

module.exports = new brandInboxPage();