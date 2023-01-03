import { forEach } from 'lodash';
import { listRender } from '../utils/useful';
import { accountList, chooseBank, accountAdd, accountDel } from './accountAPI';

export async function accountMain(list) {
	document.querySelector('main').innerHTML = ``;
	const div = document.createElement('div');
	div.id = 'accountMain';
	div.innerHTML = `
  <div class="account-container">
			<div class="account-now">
				<table>
        <caption>계좌현황
        </caption>
				<thead>
        <tr class="account-content">
        <td>은행</td>
        <td>계좌번호</td>
        <td>잔액</td>
        </tr>
				</thead>
				<tbody class="cur-account"></tbody>
        </table>
        </div>
				<button type="button" class="account-add">계좌 연결</button>
				<button type="button" class="account-delete">계좌 해지</button>	
		</div>`;

	document.querySelector('#main').append(div);

	const accountTable = div.querySelector('.cur-account');
	const accList = Array.from(await accountList());
	for (let i = 0; i < accList.length; i++) {
		const tr = document.createElement('tr');
		tr.id = `${accList[i].id}`;
		tr.innerHTML = `
    <td>${accList[i].bankName}</td>
    <td>${accList[i].accountNumber}</td>
    <td>${accList[i].balance.toLocaleString(navigator.language)}</td>
		<button type="button" class="btn-del" id="${accList[i].id}" style="display:none">해지</button>
		`;
		accountTable.append(tr);
	}
	if (accList.length === 0) {
		document.querySelector('.account-content').innerHTML = `<span>결제수단을 등록해주세요</span>`;
	}

	// 계좌추가
	const accountPlus = document.querySelector('.account-add');
	accountPlus.addEventListener('click', () => {
		div.innerHTML = ``;
		displayAdd();
	});

	async function displayAdd() {
		const res = await chooseBank();
		const div = document.createElement('div');
		div.id = 'account-add';
		div.innerHTML = `
		<button type="button" id="prev">이전</button>

		<div class="choose-container">
		</div>
		`;
		document.querySelector('#main').append(div);

		document.getElementById('prev').addEventListener('click', () => {
			accountMain();
		});

		for (let i = 0; i < res.length; i++) {
			const array = Object.values(res[i]);
			if (array[3] === false) {
				const content = document.createElement('div');
				content.id = 'chooseContent';
				content.innerHTML = `

				<button type="button" id="${array[1]}">
				${array[0]}
				</button>
				<form></form>
				`;
				div.querySelector('.choose-container').append(content);

				const btnBank = document.getElementById(`${array[1]}`);
				const digitLength = array[2].reduce((a, b) => a + b, 0);
				const form = document.querySelector('form');
				btnBank.addEventListener('click', () => {
					form.innerHTML = ``;
					form.id = `${array[1]}`;
					form.innerHTML = `
					<label for="accountNumber">계좌번호</label>
					<input name = "accountNumber" type="text"  maxlength="${digitLength}" pattern="^[0-9]+$"	required></br>
					<label for="phoneNumber">전화번호</label>
					<input type="text" name="phoneNumber"  maxlength="11" pattern="^[0-9]+$" required></br>
					<label for="signature" required>서명</label>
					<input type="text" name="signature" placeholder="이름을 입력해주세요">
					</br>
					<button class="btn-add">추가</button>
					`;
					content.append(form);

					let bankCode = '',
						accountNumber = '',
						phoneNumber = '',
						signature = '';

					form.querySelector('input[name="accountNumber"]').addEventListener('input', e => {
						accountNumber = e.target.value;
					});

					form.querySelector('input[name="phoneNumber"]').addEventListener('input', e => {
						phoneNumber = e.target.value;
					});

					form.querySelector('input[name="signature"]').addEventListener('input', e => {
						if (e.target.value.trim().length > 0) {
							signature = true;
						} else signature = false;
					});

					form.addEventListener('submit', e => {
						e.preventDefault();
						bankCode = form.id;
						accountAdd(bankCode, accountNumber, phoneNumber, signature);
					});
				});
			}
		}
	}

	// 계좌삭제
	const accountDelEl = document.querySelector('.account-delete');
	const btnDeleteAll = document.querySelectorAll('.btn-del');
	accountDelEl.addEventListener('click', () => {
		btnDeleteAll.forEach(e => {
			e.style.display = 'block';
		});
	});

	btnDeleteAll.forEach(e => {
		e.addEventListener('click', element => {
			let input = confirm('계좌를 삭제하겠습니까?');
			accountDel(e.id, input);
		});
	});
}
