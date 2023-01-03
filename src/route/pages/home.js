import { modalGenerate, ButtonGenerate, numTostring, swiperGenerate } from '../../utils/useful';

import { promotionGenerate } from '../../promotion/default-form.js';
import { product, store } from '../../utils/store';
import { allSearch } from '../../product-data/product-api';

function Home($selector) {
	this.$selector = $selector;

	this.setState = () => {
		this.render();
	};

	this.render = async () => {
		this.$selector.innerHTML = ``;
		await allSearch();

		const arr = await promotionGenerate();
		arr.forEach(item => {
			this.$selector.append(item);
		});

		const result = arr.map((item, index) => {
			const number = numTostring(index + 1);
			return swiperGenerate(number);
		});
	};

	this.render();
}

export default Home;
