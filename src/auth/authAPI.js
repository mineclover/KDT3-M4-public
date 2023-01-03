import axios from 'axios';

import { address, DefaultHeader } from '../apiKey';
import { modalEditInfo, modalSignIn, modalSignup } from './Modal-form';
import { modalGenerate } from '../utils/useful';
import { toast } from '../utils/useful';

authConfirm()
	.then(res => {
		AfterSignIn();
	})
	.catch(err => {
		BeforeSignIn();
	});

export async function signUp({ email, password, displayName, profileImgBase64 }) {
	try {
		await axios(address + '/auth/signup', {
			method: 'POST',
			headers: DefaultHeader,
			data: JSON.stringify({ email, password, displayName, profileImgBase64 })
		}).then(res => {
			const { accessToken, user } = res.data;
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('user', JSON.stringify(user));
			AfterSignIn();
		});
	} catch (error) {
		if (error.response.status === 401) {
			toast(error.response.data);
		}
	}
}

export async function signIn(email, password) {
	try {
		await axios(address + '/auth/login', {
			method: 'POST',
			headers: DefaultHeader,
			data: JSON.stringify({ email, password })
		}).then(res => {
			const { accessToken, user } = res.data;
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('user', JSON.stringify(user));
			AfterSignIn();
		});
	} catch (error) {
		toast(error.response.data);
	}
}

/**
 * 인증 확인
 * 토큰만 있을 때 유저 정보를 가져옴
 */
export async function authConfirm() {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject('토큰이 없습니다.');
	}
	await axios(address + '/auth/me', {
		method: 'POST',
		headers: { ...DefaultHeader, Authorization: `Bearer ${token}` }
	})
		.then(res => {
			const user = res.data;
			localStorage.setItem('user', JSON.stringify(user));
		})
		.catch(err => {
			return Promise.reject('로그인 에러');
		});
}

async function signOut() {
	try {
		const token = localStorage.getItem('accessToken');
		const res = await axios(address + '/auth/logout', {
			method: 'POST',
			headers: { ...DefaultHeader, Authorization: `Bearer ${token}` }
		});
	} catch (error) {
		toast(error.response.data);
	}
}

export async function editInfo(displayName, profileImgBase64, oldPassword, newPassword) {
	try {
		const token = localStorage.getItem('accessToken');
		const res = await axios(address + '/auth/user', {
			method: 'PUT',
			headers: {
				...DefaultHeader,
				Authorization: `Bearer ${token}`
			},
			data: JSON.stringify({ displayName, profileImgBase64, oldPassword, newPassword })
		}).then(res => {
			const user = res.data;
			localStorage.setItem('user', JSON.stringify(user));
			AfterSignIn();
		});
	} catch (error) {
		toast(error.response.data);
	}
}

export function AfterSignIn() {
	const userBox = document.querySelector('div.nav-auth');
	const user = JSON.parse(localStorage.getItem('user'));
	userBox.innerHTML = `
	<button class="gnb_my">
  <img src="${user.profileImg ? user.profileImg : ''}" class="after-sign-img">
  <span>${user.displayName} <i class="fa-solid fa-caret-down"></i></span>
	</button>
	<div class="gnb_dropdown">
	<div class="first-col">
	<img src="${user.profileImg ? user.profileImg : ''}" class="after-toggle-img">
	</div>
	<div class="second-col">
	<span>${user.displayName}님</span>
	<button type="button" id="signOut">로그아웃</button></br>
	<span>${user.email}</span>
	<button type="button" id="btn-editInfo">내 정보 수정</button>
	</div>
	</div>
  `;
	const navAccount = document.createElement('a');
	navAccount.href = '/#account';
	navAccount.innerHTML = `<i class="fa-solid fa-won-sign"></i>결제수단 관리	`;

	document.querySelector('.gnb_my').addEventListener('click', () => {
		document.querySelector('.gnb_dropdown').classList.toggle('on');
	});

	userBox.querySelector('#signOut').addEventListener('click', function handle() {
		signOut();

		localStorage.removeItem('accessToken');
		localStorage.removeItem('user');
		BeforeSignIn();
		history.go(0);
		userBox.removeEventListener('click', handle);
	});

	userBox.querySelector('#btn-editInfo').addEventListener('click', () => {
		modalEditInfo(modalGenerate());
	});
	userBox.append(navAccount);
	document.querySelector('.first-row').append(userBox);
}

export function BeforeSignIn() {
	const userBox = document.querySelector('div.nav-auth');

	userBox.innerHTML = `
  <button type="button" id="signInBtn">로그인</button>
  <button type="button" id="signUpBtn">회원가입</button>
  `;

	userBox.querySelector('#signInBtn').addEventListener('click', () => {
		modalSignIn(modalGenerate());
	});

	userBox.querySelector('#signUpBtn').addEventListener('click', () => {
		modalSignup(modalGenerate());
	});
	document.querySelector('.first-row').append(userBox);
}
