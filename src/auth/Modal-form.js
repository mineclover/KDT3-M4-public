import { user } from '../utils/store';
import { signOut, authConfirm, signIn, signUp, editInfo, AfterSignIn } from './authAPI';

//<section class="section-auth"></section>
export async function modalSignup(element) {
	const sectionAuth = element;
	sectionAuth.innerHTML = '';
	const modalContent = document.createElement('div');
	modalContent.id = 'modal-content';

	const h1 = document.createElement('h1');
	h1.innerText = '회원가입';
	const form = document.createElement('form');
	let email = '';
	let password = '';
	let displayName = '';
	let profileImgBase64 = '';

	form.id = 'signUp';
	form.innerHTML = `
  <div class = "picture">
  <label for="picture">프로필 이미지</label>
  <input type = "file" id = "picture" name="picture">
  </div>
  <div class = "form-control">
    <label for="email">이메일</label>
    <input type = "email" id="email" name="email" placeholder="email" required>
  
  </div>
  <div class = "form-control">
    <label for="password">비밀번호</label>
    <input type="password" id="password" name="password" pattern="^(?=.*[\\w#?!@$%^&*-]).{8,}$" placeholder="password" required>
    <span id="pwCheck"></span><span id="capsCheck"></span>
  </div>
  <div class = "form-control">
    <label for="password">비밀번호 확인</label>
    <input type="password" id="password-confirm" name="password-confirm" minlength="8" placeholder="confirm-password" required>
    <span id="pwConfirm"></span>
  </div>
  <div class = "form-control">
    <label for="userName">이름</label></label>
    <input type="text" id="userName" name="userName" maxlength="20" placeholder="name"required>
  </div>

  <button class="btn-signup">회원가입</button>
  <div id="auth-alternative">
  <span>이미 계정이 있으신가요?</span>      
  <button type="button" class="btn-signin">로그인</button>

  </div>
  `;

	const emailInputEL = form.querySelector('#email');
	emailInputEL.addEventListener('input', () => {
		email = emailInputEL.value;
	});

	const passwordInputEL = form.querySelector('input[type="password"]');

	const pwCheckEl = form.querySelector('#pwCheck');
	const pwConfirmEl = form.querySelector('#pwConfirm');
	const capsCheck = form.querySelector('#capsCheck');

	passwordInputEL.addEventListener('keydown', event => {
		if (event.getModifierState('CapsLock')) {
			capsCheck.innerHTML = `Caps Lock이 켜져 있습니다.`;
		} else {
			capsCheck.innerHTML = ``;
		}
	});

	passwordInputEL.addEventListener('input', e => {
		//const reg = /^(?=.*?[a-z])(?=.*?[#?!@$%^&*-])(?=.*?[0-9]).{8,}$/;
		const reg = /^(?=.*[\w#?!@$%^&*-]).{8,}$/;
		//const reg = /^\w.{8,}$/;
		let pwValue = reg.test(e.target.value);

		if (pwValue) {
			pwCheckEl.innerText = '올바른 비밀번호형식입니다';
			querySelector('input[name="password-confirm"]').addEventListener('input', e => {
				if (passwordInputEL.value === e.target.value) {
					pwConfirmEl.innerText = '비밀번호가 일치합니다';
					e.target.setCustomValidity('');
					password = passwordInputEL.value;
				} else {
					password = null;
					pwConfirmEl.innerText = '비밀번호 불일치';
					e.target.setCustomValidity('비밀번호가 일치하지 않습니다.');
				}
			});
		} else {
			password = null;
			pwCheckEl.innerText = '잘못된 비밀번호형식입니다. (영문 + 숫자 + 특수문자 8글자이상)';
		}
	});

	form.querySelector('#userName').addEventListener('input', e => {
		displayName = e.target.value;
	});

	form.querySelector('.btn-signin').addEventListener('click', () => {
		modalSignIn(sectionAuth);
	});

	const inputEl = form.querySelector('#picture');
	inputEl.addEventListener('change', event => {
		const { files } = inputEl;
		for (const file of files) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.addEventListener('load', async e => {
				profileImgBase64 = e.target.result;
			});
		}
	});

	form.addEventListener('submit', e => {
		e.preventDefault();
		signUp({ email, password, displayName, profileImgBase64 });
		document.querySelector('.backdrop').remove();
	});

	modalContent.append(h1, form);
	sectionAuth.append(modalContent);
	document.body.append(sectionAuth);
}

export async function modalSignIn(element) {
	const sectionAuth = element;
	const modalContent = document.createElement('div');
	modalContent.id = 'modal-content';

	let email = '';
	let password = '';

	sectionAuth.innerHTML = '';
	const h1 = document.createElement('h1');
	h1.innerText = '로그인';
	const form = document.createElement('form');
	form.id = 'signIn';
	form.innerHTML = `
  <div>
    <label for="email">이메일</label>
    <input type = "email" name="email" id="userEmail" placeholder = "email" required>
  </div>
  <div>
    <label for="password">비밀번호</label>
    <input type="password" name="password" id="password" placeholder="password" required>
		<span id="capsCheck"></span>
  </div>
  <button class="btn-signin">로그인</button>
  <div id="auth-alternative">
  <span>회원이 아니신가요?</span>
  </br>
  <button type="button" class="btn-signup">회원가입</button>
  </div>
  `;
	const passwordInputEL = form.querySelector('input[type="password"]');
	const capsCheck = form.querySelector('#capsCheck');

	passwordInputEL.addEventListener('keydown', event => {
		if (event.getModifierState('CapsLock')) {
			capsCheck.innerHTML = `Caps Lock이 켜져 있습니다.`;
		} else {
			capsCheck.innerHTML = ``;
		}
	});
	form.querySelector('input[name="email"]').addEventListener('input', e => {
		email = e.target.value;
	});

	form.querySelector('input[name="password"]').addEventListener('input', e => {
		password = e.target.value;
	});

	form.querySelector('.btn-signup').addEventListener('click', () => {
		modalSignup(sectionAuth);
	});

	form.addEventListener('submit', e => {
		e.preventDefault();
		signIn(email, password);
		document.querySelector('.backdrop').remove();
	});

	modalContent.append(h1, form);
	sectionAuth.append(modalContent);
	document.body.append(sectionAuth);
}

export function modalEditInfo(element) {
	const sectionAuth = element;
	const modalContent = document.createElement('div');
	modalContent.id = 'modal-content';
	sectionAuth.innerHTML = '';
	const h1 = document.createElement('h1');
	h1.innerText = '사용자 정보 수정';
	const form = document.createElement('form');
	let displayName = '';
	let profileImgBase64 = '';
	let oldPassword = '';
	let newPassword = '';

	form.id = 'editInfo';
	form.innerHTML = `
  <div class = "picture">
  <label for="picture">프로필 이미지</label>
  <input type = "file" id = "picture" name="picture">
  </div>
  <div class = "form-control">
    <label for="userName">이름</label>
    <input type = "text" id="userName" name="userName" placeholder="name">
  </div>
  <div class = "form-control">
    <label for="old-password">기존 비밀번호</label>
    <input type="password" id="old-password" name="old-password" pattern="^(?=.*[\\w#?!@$%^&*-]).{8,}$" placeholder="password" required><span id="capsCheck"></span>
  </div>
  <div class = "form-control">
	<label for="new-password">새로운 비밀번호</label>
	<input type="password" id="new-password" name="new-password" pattern="^(?=.*[\\w#?!@$%^&*-]).{8,}$" placeholder="password" required><span id="capsCheck"></span>
  </div>
	<button class="btn-edit">확인</button>

  `;
	const passwordInputEL = form.querySelector('input[type="password"]');
	const capsCheck = form.querySelector('#capsCheck');

	passwordInputEL.addEventListener('keydown', event => {
		if (event.getModifierState('CapsLock')) {
			capsCheck.innerHTML = `Caps Lock이 켜져 있습니다.`;
		} else {
			capsCheck.innerHTML = ``;
		}
	});

	const inputEl = form.querySelector('#picture');
	inputEl.addEventListener('change', event => {
		const { files } = inputEl;
		for (const file of files) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.addEventListener('load', async e => {
				profileImgBase64 = e.target.result;
			});
		}
	});

	form.querySelector('input[name="userName"]').addEventListener('input', e => {
		displayName = e.target.value;
	});

	form.querySelector('input[name="old-password"]').addEventListener('input', e => {
		oldPassword = e.target.value;
	});

	form.querySelector('input[name="new-password"]').addEventListener('input', e => {
		newPassword = e.target.value;
	});

	form.addEventListener('submit', e => {
		e.preventDefault();
		editInfo(displayName, profileImgBase64, oldPassword, newPassword);
		document.querySelector('.backdrop').remove();
	});

	modalContent.append(h1, form);
	sectionAuth.append(modalContent);
	document.body.append(sectionAuth);
}
