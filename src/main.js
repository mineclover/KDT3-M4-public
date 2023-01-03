import {} from './auth/authAPI';
import App from './route/app';
import { $ } from './route/utils/querySelector';

window.addEventListener('DOMContentLoaded', e => {
	new App($('#main'));
});
