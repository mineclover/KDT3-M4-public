import { routes } from './routeInfo';
import NotFound from './pages/notfound';

function Router($selector) {
	this.$selector = $selector;
	let currentPage = undefined;

	const route = () => {
		currentPage = null;
		let TargetPage = routes.find(route => route.path.test(location.hash))?.element || NotFound;
		currentPage = new TargetPage(this.$selector);
	};

	const init = () => {
		window.addEventListener('historychange', ({ detail }) => {
			const { to, isReplace } = detail;

			if (isReplace || to === location.pathname) {
				history.replaceState(null, '', to);
			} else history.pushState(null, '', to);

			route();
		});

		window.addEventListener('popstate', () => {
			route();
		});
	};

	init();
	route();
}

export default Router;
