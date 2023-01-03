let { API_KEY } = process.env;
let { USER_NAME } = process.env;

export const address = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api';

export const DefaultHeader = {
	'Content-Type': 'application/json',
	apikey: `${API_KEY}`,
	username: `${USER_NAME}`
};
