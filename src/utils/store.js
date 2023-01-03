export const store = {
	all: [],
	userProducts: [],
	sellProducts: [],
	top: []
};

// 뭐가 더 빠른지 한번 해보자
export const product = {};
export let productTarget = '';

export let interval = {
	'layout-order': '1'
};

export const user = {
	id: '',
	userName: '',
	profileImg: '',
	loginCheck: () => {
		return user.id ? true : false;
	}
};
// 개별 export 빼고 하는 이것도 될 것이다
// export { all, userProducts, sellProducts, top }

export const modalContainer = document.querySelector('.modal-container');
