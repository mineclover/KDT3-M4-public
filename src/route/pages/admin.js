import { render as productAdd } from '../../product-data/product-add';
import { modalGenerate, ButtonGenerate } from '../../utils/useful';

function admin($selector) {
	this.$selector = $selector;

	this.setState = () => {
		this.render();
	};

	this.render = () => {
		this.$selector.innerHTML = ``;

		const test = () => {
			const addInput = productAdd();
			const modal = modalGenerate();
			modal.appendChild(addInput);

			document.querySelector('main').append(modal);
		};

		const open = ButtonGenerate('product-add', test);
		this.$selector.append(open);
	};
	this.render();
}
export default admin;
