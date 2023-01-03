import Home from './pages/home';
import Account from './pages/account';
import Promotion from './pages/promotion';
import admin from './pages/admin';

export const BASE_URL = 'https://mdt-3-m4-bang.vercel.app';

export const routes = [
	{ path: /^$/, element: Home },
	{ path: /^#account$/, element: Account },
	{ path: /^#promotion$/, element: Promotion },
	{ path: /^#admin$/, element: admin }
];
