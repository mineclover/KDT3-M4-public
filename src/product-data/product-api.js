import axios from 'axios';
import { store, product } from '../utils/store';
import { address, DefaultHeader } from '../apiKey';

/**
 * return이 없다
 * store.all에 저장함..
 */
export async function allSearch() {
	const res = await axios(address + `/products `, {
		method: 'GET',
		headers: { ...DefaultHeader, masterKey: 'true' }
	});

	store.all = res.data;

	// all = res.data;
}

export async function textSearch(...args) {
	const res = store.all.filter(item => args.every(arg => item.tags.includes(arg)));

	return res;
}

export async function editProduct(id, jsonData) {
	const res = await axios(address + `/products/${id} `, {
		method: 'PUT',
		headers: { ...DefaultHeader, masterKey: 'true' },
		data: jsonData
	});

	const target = store.all.filter(item => item.id.includes(id));
	target[0] = res.data;
}

export async function detailInfo(id) {
	const res = await axios(address + `/products/${id} `, {
		method: 'GET',
		headers: { ...DefaultHeader, masterKey: 'true' }
	});

	product.temp = res.data;
}

export async function productPost(jsonData) {
	const { title, price, description, tags, thumbnailBase64, photoBase64 } = JSON.parse(jsonData);

	const res = await axios(address + `/products`, {
		method: 'POST',
		headers: { ...DefaultHeader, masterKey: 'true' },
		data: JSON.stringify({ title, price, description, tags, thumbnailBase64, photoBase64 })
	});
}

/**
 * 이 함수를 사용하게 될 때 아마도 input들의 상태를 받아서 보낼 것 같고
 * 뭐...
 * @param {String} timeValue Date: ISOString
 * @param {Object} item
 * @param {} promotionId 이 아이디를 기반으로 이벤트 배너 데이터를 가져옴
 * @param {*} openTime Date: ISOString
 * @returns body에 담을 수 있는 형태로 리턴
 */
export function showcaseAdd(timeValue, item, promotionId, openTime) {
	let date = new Date();
	const title = item.title;
	const price = item.price;
	const description = item.description;
	if (openTime) {
		date = `${date}, ${openTime}`;
	}
	const tags = ['ShowCase', `${date.toISOString()}`, `${promotionId}`, ...item.tags];
	const thumbnailBase64 = item?.thumbnailBase64;
	const photoBase64 = item?.photoBase64;

	// 자동으로 undefined 값은 비워준다
	const result = JSON.stringify({ title, price, description, tags, thumbnailBase64, photoBase64 });

	return result;
}

export async function deleteProduct(text) {
	const res = await axios(address + `/products/${text} `, {
		method: 'DELETE',
		headers: { ...DefaultHeader, masterKey: 'true' }
	});
	return deleteStore(text);
}

/**
 * 스토어에서만 해당 제품을 삭제함
 * @param {string} id
 */
function deleteStore(id) {
	const index = store.all.findIndex(item => item.id === id);
	store.all.splice(index, 1);

	return store.all;
}
