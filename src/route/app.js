import { navigate } from './utils/navigate';
import { $ } from './utils/querySelector';
import { BASE_URL } from './routeInfo';
import Router from './router';

function App($selector) {
	this.$selector = $selector;
	const init = () => {
		$('.first-row').addEventListener('click', e => {
			const target = e.target.closest('a');
			if (!(target instanceof HTMLAnchorElement)) return;

			e.preventDefault();
			const targetURL = target.href.replace(BASE_URL, '');
			navigate(targetURL);
		});

		new Router($selector);
	};

	init();
}

export default App;
