import axios from 'axios';

import { address, DefaultHeader } from '../apiKey';
import { toast } from '../utils/useful';
import { accountMain } from './account-form';

export async function accountList() {
	try {
		const token = localStorage.getItem('accessToken');
		if (!token) {
			return Promise.reject('토큰이 없습니다.');
		}
		const res = await axios(address + '/account', {
			method: 'GET',
			headers: { ...DefaultHeader, Authorization: `Bearer ${token}` }
		});
		return res.data.accounts;
	} catch (error) {
		toast(error.response.data);
	}
}

export async function chooseBank() {
	try {
		const token = localStorage.getItem('accessToken');
		if (!token) {
			return Promise.reject('토큰이 없습니다.');
		}
		const res = await axios(address + '/account/banks', {
			method: 'GET',
			headers: { ...DefaultHeader, Authorization: `Bearer ${token}` }
		});

		return res.data;
	} catch (error) {
		toast(error.response.data);
	}
}

export async function accountAdd(bankCode, accountNumber, phoneNumber, signature) {
	try {
		const token = localStorage.getItem('accessToken');
		if (!token) {
			return Promise.reject('토큰이 없습니다.');
		}
		const res = await axios(address + '/account', {
			method: 'POST',
			headers: { ...DefaultHeader, Authorization: `Bearer ${token}` },
			data: JSON.stringify({ bankCode, accountNumber, phoneNumber, signature })
		});

		accountMain();
		toast('새로운 계좌가 추가되었습니다.');
		return res;
	} catch (error) {
		toast(error.response.data);
	}
}

export async function accountDel(accountId, signature) {
	try {
		const token = localStorage.getItem('accessToken');
		if (!token) {
			return Promise.reject('토큰이 없습니다.');
		}
		const res = await axios(address + '/account', {
			method: 'DELETE',
			headers: { ...DefaultHeader, Authorization: `Bearer ${token}` },
			data: JSON.stringify({ accountId, signature })
		});

		accountMain();
		toast('계좌가 삭제되었습니다.');
		return res;
	} catch (error) {
		toast(error.response.data);
	}
}
