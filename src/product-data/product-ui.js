import { allSearch, deleteProduct, textSearch } from './product-api';
import { options } from './product-add';
import { store } from '../utils/store';
import { tagRender, showCaseData } from '../utils/useful';
import P from '../product-data/product-store';

function getClassType(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1);
}

export const addFormUpdate = item => {
	const tagsRight = document.querySelector('.add-info .tags-area .tags-right');
	const tagListCb = () => {
		const temp = item.tags.map(tag => {
			return tagRender(tag);
		});
		return temp;
	};
	if (getClassType(item) === 'Object') {
		if (tagsRight) {
			tagsRight.innerHTML = '';
			tagsRight.append(...tagListCb());
		}

		const id = document.querySelector('.add-warp .add-info-box input.id');
		id.value = item.id;
		const title = document.querySelector('.add-warp .add-info-box input.title');
		title.value = item.title;
		const price = document.querySelector('.add-warp .add-info-box input.price');
		price.value = item.price;
		const description = document.querySelector('.add-warp .add-info-box textarea.description');
		description.value = item.description;
	}

	let thumbnail = document.querySelector('.add-warp .add-info-box input.thumbnailBase64');
	thumbnail.value = '';
	thumbnail.nextSibling.src = '';
	let photo = document.querySelector('.add-warp .add-info-box input.photoBase64');
	photo.value = '';
	photo.nextSibling.src = '';
	P.photoBase64 = '';
	P.thumbnailBase64 = '';
};

export async function showCaseRender(cur, showcases) {
	if (!showcases) {
		showcases = await textSearch('showcase');
	}
	cur.innerHTML = '';

	const container = document.createElement('ul');
	container.classList.add('container');

	const temp = showcases.map((item, index) => {
		const { id, title, price, description, tags, thumbnail, photo } = item;
		const div = document.createElement('li');

		div.classList.add('product');
		div.innerHTML = `
      <div class="thumbnail">
        <img src="${thumbnail ? thumbnail : ''}" alt="${title} 썸네일">

      </div>
      <div class="info">
        <p class="title">${title}</p>
        <p class="price">${price}</p>
        <div class="date"><p>${tags[2]}</p><p>간격 : ${tags[3]}시간</p></div>
        <p class="tags">#${tags[4]} #${tags[5]} #${tags[6]}</p>
        <p class="description">${description}</p>
        <section class="showcase-menu">
          <div class="toPromotion">
            <p class="gotoButton">상위 프로모션 보기</p>
            <p class='arrow'>▶</p>
          </div>
          <div class="toReplica">
            <p class="gotoButton">하위 레플리카 보기</p>
            <p class='arrow'>▶</p>
          </div>
        </section>
        <button class="delete-btn" alt="삭제"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `;

		div.querySelectorAll('.delete-btn').forEach(item => {
			item.addEventListener('click', async function handler() {
				const ids = id;

				await deleteProduct(ids);
				allSearch()
					.then(() => {
						textSearch('showcase');
					})
					.then(res => {
						showCaseRender(cur, res);
					});
				item.removeEventListener('click', handler);
			});
		});

		div.addEventListener('click', async function handler(event) {
			const baseOptions = document.querySelector('.option-box');
			const ids = id;
			let arr = event.target.className;
			if (['delete-btn', 'fa-solid fa-xmark'].includes(arr)) {
				await Promise.all([deleteProduct(ids), allSearch()]);
				const res = await textSearch('showcase');
				const target = document.querySelector('.result-box .result-scroll');
				showCaseRender(target, res);
				return div.removeEventListener('click', handler);
			} else if (event.target.closest('.toPromotion')) {
				await allSearch();
				const res = await textSearch('showcase', ids);
				baseOptions.innerHTML = '';
				options('showcase', showCaseData, baseOptions);
				const target = document.querySelector('.result-box .result-scroll');
				showCaseRender(target, res);
				return div.removeEventListener('click', handler);
			} else if (event.target.closest('.toReplica')) {
			} else {
				// 특정 요소로 값 전달
				// 그런데 만약 현재 페이지가 ~ 라면 어디로 전달
				addFormUpdate(item);
			}
		});
		return div;
	});
	temp.forEach(item => container.appendChild(item));

	cur.append(container);
}

export async function allCaseRender(cur, arr) {
	if (!arr) {
		await allSearch();
		arr = store.all;
	}
	cur.innerHTML = '';

	const container = document.createElement('ul');
	container.classList.add('container');

	const temp = arr.map((item, index) => {
		const { id, title, price, description, tags, thumbnail, photo } = item;
		const div = document.createElement('li');

		div.classList.add('product');
		div.innerHTML = `
      <div class="thumbnail">
        <img src="${thumbnail ? thumbnail : ''}" alt="${title} 썸네일">

      </div>
      <div class="info">
        <p class="title">${title}</p>
        <p class="price">${price}</p>
        <div class="date"><p>${tags[2]}</p><p>간격 : ${tags[3]}시간</p></div>
        <p class="tags">#${tags[4]} #${tags[5]} #${tags[6]}</p>
        <p class="description">${description}</p>
        <button class="delete-btn" alt="삭제"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `;

		div.querySelectorAll('.delete-btn').forEach(item => {
			item.addEventListener('click', async function handler() {
				const ids = id;

				await deleteProduct(ids);
				allSearch().then(res => {
					allCaseRender(cur, res);
				});
				item.removeEventListener('click', handler);
			});
		});

		div.addEventListener('click', async function handler(event) {
			const baseOptions = document.querySelector('.option-box');
			const ids = id;
			let arr = event.target.className;
			if (['delete-btn', 'fa-solid fa-xmark'].includes(arr)) {
				const rest = await deleteProduct(ids);

				const target = document.querySelector('.result-box .result-scroll');
				allCaseRender(target, rest);
				return div.removeEventListener('click', handler);
			} else {
				// 특정 요소로 값 전달
				// 그런데 만약 현재 페이지가 ~ 라면 어디로 전달
				addFormUpdate(item);
			}
		});
		return div;
	});
	temp.forEach(item => container.appendChild(item));

	cur.append(container);
}

export async function promotionRender(cur, promotions) {
	cur.innerHTML = '';
	// store.all 에 데이터 저장되는 코드
	// 용도별로 store 분리 해야한다
	// 서치로 찾느냐, 아니면 store.all 에 있는 데이터를 가져오느냐
	// allSearch > 분류해서 제공 , 또는 검색해서 제공.. 둘 중 뭐가 빠를까?

	const container = document.createElement('ul');
	container.classList.add('container');

	const temp = promotions.map((item, index) => {
		const { id, title, price, description, tags, thumbnail, photo } = item;
		const div = document.createElement('li');

		div.classList.add('product');
		div.innerHTML = `
      <div class="thumbnail">
        <img class="thumbnail" src="${thumbnail ? thumbnail : ''}" alt="${title} 썸네일">
      </div>
      <div class="info">
        <p class="title">${title}</p>
        <p class="price">${price}원으로 시작</p>
        <div class="date"><p>${tags[2]}</p>~<p>${tags[3]}</p></div>
        <p class="tags">#${tags[4]} #${tags[5]} #${tags[6]}</p>
        <p class="description">${description}</p>
        <div class="toPromotion">
          <p class="gotoButton">하위 쇼케이스 보기</p>
          <p class='arrow'>▶</p>
        </div>
        <button class="delete-btn" alt="삭제"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `;

		div.addEventListener('click', async function handler(event) {
			const baseOptions = document.querySelector('.option-box');
			const ids = id;
			let arr = event.target.className;
			if (['delete-btn', 'fa-solid fa-xmark'].includes(arr)) {
				await Promise.all([deleteProduct(ids), allSearch()]);
				const res = await textSearch('promotion');
				const target = document.querySelector('.result-box .result-scroll');
				promotionRender(target, res);
				return div.removeEventListener('click', handler);
			} else if (['toPromotion', 'arrow', 'gotoButton'].includes(arr)) {
				await allSearch();
				const res = await textSearch('showcase', ids);
				baseOptions.innerHTML = '';
				options('showcase', showCaseData, baseOptions);
				const target = document.querySelector('.result-box .result-scroll');
				showCaseRender(target, res);
				return div.removeEventListener('click', handler);
			} else {
				// 특정 요소로 값 전달
				// 그런데 만약 현재 페이지가 ~ 라면 어디로 전달
				addFormUpdate(item);
			}
		});
		return div;
	});
	temp.forEach(item => container.appendChild(item));

	cur.append(container);
}
