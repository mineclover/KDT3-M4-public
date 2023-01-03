function NotFound($selector) {
	this.$selector = $selector;

	this.setState = () => {
		this.render();
	};

	this.render = () => {
		this.$selector.innerHTML = `
    404 NOT FOUND
    `;
	};

	this.render();
}

export default NotFound;
