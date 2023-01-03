import P from './product-store';
import { store } from '../utils/store';
import { productTarget, interval } from '../utils/store';
import {
	defaultRender,
	inputGenerate,
	textAreaGenerate,
	listRender,
	getAddData,
	ButtonGenerate,
	tagRender,
	PromotionData,
	showCaseData,
	hr
} from '../utils/useful';
import { productPost, allSearch, textSearch, editProduct } from './product-api';
import { render as TestRender, showCaseRender, promotionRender, addFormUpdate, allCaseRender } from './product-ui';

/**
 * 타겟을 넣어야한다 타겟은 이걸 제어하는 UI가 나오는 컴포넌트 블럭
 * @param {string} text : promotion, product,
 * @param {Element} target : .result-box .result-scroll
 * @returns {Element} 태그 인풋을 담은
 */

export function options(menu, inputData, baseOptions) {
	if (inputData) {
		inputData.forEach((item, index) => {
			const input = inputGenerate(item.name, item.target, item.other, item.type, item.header);

			baseOptions.append(input);

			input.addEventListener('change', e => {
				const tagsBox = document.querySelector('.option-box .tags-area .tags-right');
				interval[item.name] = e.target.value;

				const tags = tagsBox.querySelectorAll('li');
				const target = tags[index + 1].querySelector('span.value');
				target.textContent = e.target.value;

				if (item.type === 'datetime-local' && (item.name === 'start' || item.name === 'end')) {
					let temp = new Date(e.target.value);
					interval[item.name] = temp.toISOString();
					target.textContent = temp.toISOString();
					const start = new Date(interval.start);
					const end = new Date(interval.end);
				}
			});
			input.addEventListener('keydown', e => {
				if (e.key == 'Enter') {
					const tagsBox = document.querySelector('.option-box .tags-area .tags-right');
					interval[item.name] = e.target.value;

					const tags = tagsBox.querySelectorAll('li');
					const target = tags[index + 1].querySelector('span.value');
					target.textContent = e.target.value;

					if (item.type === 'datetime-local' && (item.name === 'start' || item.name === 'end')) {
						let temp = new Date(e.target.value);
						interval[item.name] = temp.toISOString();
						target.textContent = temp.toISOString();
						const start = new Date(interval.start);
						const end = new Date(interval.end);
					}
				}
			});
			/**
			 * 분 초 밀리세컨드를 0으로 초기화 ,
			 * 현재시간을 받은 값을 사용할 경우 +9 시간을 해줘야 한국 시간으로 맞춰짐 ( spilt을 써서 변환이 안됨 )
			 * @param {date} target
			 * @param {number} hour 입력 값 그대로 적용됨
			 * @param {number} day
			 */
			function setAuctionTime(target, hour, day) {
				target.setDate(target.getDate() + day);
				target.setHours(hour);
				target.setMinutes(0);
				target.setSeconds(0);
				target.setMilliseconds(0);
			}

			function init(axis) {
				if (axis === 'promotion') {
					if (item.name === 'start') {
						let temp = new Date();
						setAuctionTime(temp, temp.getHours() + 9, 0);
						temp = temp.toISOString();
						input.querySelector('input').value = temp.slice(0, 16);

						interval[item.name] = temp;
					} else if (item.name === 'end') {
						let temp = new Date();

						setAuctionTime(temp, temp.getHours() + 9, 20);
						temp = temp.toISOString();
						input.querySelector('input').value = temp.slice(0, 16);
						interval[item.name] = temp;
					} else if (item.name === 'layout-order') {
						// 카테고리 별 종목 길이에 따라 설정하고 싶은데 모듈 호출 순서를 보장하지 못해서 10으로 고정
						input.querySelector('input').value = 10;
						interval['layout-order'] = 10;
					}
				} else if (axis === 'showcase') {
					if (item.name === 'start') {
						let temp = new Date();
						setAuctionTime(temp, temp.getHours() + 9, 1);
						temp = temp.toISOString();
						input.querySelector('input').value = temp.slice(0, 16);

						interval[item.name] = temp;
					} else if (item.name === 'end') {
						input.querySelector('input').value = 12;
						interval[item.name] = 12;
					} else if (item.name === 'layout-order') {
						input.querySelector('input').value = '종속될 프로모션 아이디 입력';
						interval['layout-order'] = '종속될 프로모션 아이디 입력';
					}
				}
			}
			init(menu);
		});
	}
	function tagsInteraction() {
		const tagsArea = document.createElement('div');
		tagsArea.classList.add('tags-area');
		const tagsRight = document.createElement('ul');
		tagsRight.classList.add('tags-right');

		const tagUI = {
			type: 'text',
			name: 'tags',
			target: '',
			header: '태그 추가',
			other: 'placeholder="태그 입력 후 엔터" value="제품" autocomplete="tags"'
		};
		tagsArea.append(inputGenerate(tagUI.name, tagUI.target, tagUI.other, tagUI.type, tagUI.header));
		tagsArea.appendChild(tagsRight);

		const tagsOptionSubmit = () => {
			const tags = tagsRight.querySelectorAll('li');
			const tagList = [];
			if (tags.length > 4) {
				for (let i = 4; i < tags.length; i++) {
					if (tags[i].classList.contains('tag')) {
						const target = tags[i].querySelector('span.value');
						const value = target.innerText;
						tagList.push(value);
					}
				}
			}
			const result = [menu, interval['layout-order'], interval.start, interval.end, ...tagList];
			const add = result.map(item => tagRender(item));
			tagsRight.innerHTML = '';
			tagsRight.append(...add);
		};
		tagsOptionSubmit();

		tagsArea.querySelector('input').addEventListener('keydown', e => {
			if (e.key === 'Enter') {
				const tag = e.target.value;
				e.target.value = '';
				tagsRight.append(tagRender(tag));
			}
		});

		return tagsArea;
	}

	baseOptions.append(hr());
	baseOptions.append(tagsInteraction());
}

/**
 * 메인 기능 중 하나.. 태그에 맞는 데이터 불러오는 기능
 * @param {*} text
 * @param {*} target
 * @returns
 */
function tagDefault(text, target) {
	const baseOptions = document.createElement('div');
	baseOptions.classList.add('option-box');
	addFormUpdate([text]);
	P.tags.length = 4;

	if (text === 'promotion') {
		options('promotion', PromotionData, baseOptions);
		allSearch().then(() => {
			textSearch('promotion').then(res => {
				promotionRender(target, res);
			});
		});
	} else if (text === 'showcase') {
		options('showcase', showCaseData, baseOptions);
		allSearch().then(() => {
			textSearch('showcase').then(res => {
				showCaseRender(target, res);
			});
		});
	} else if (text === 'replica') {
		options('replica', '', baseOptions);
		textSearch('replica').then(res => {
			showCaseRender(target, res);
		});
	} else if (text === 'ALL') {
		options('ALL', '', baseOptions);
		allSearch().then(res => {
			allCaseRender(target, store.all);
		});
	}

	return baseOptions;
}

// 메인 컴포넌트에 ui를 넣을 것임
// 제품 추가에 필요한 div를 만들 거임
const inputData = [
	{
		type: 'text',
		name: 'id',
		target: P,
		header: '고유 번호',
		other: 'value="" readonly'
	},
	{
		type: 'text',
		name: 'title',
		target: P,
		header: '상품 제목',
		other: 'placeholder="title" value="상품 제목" autocomplete="title"'
	},
	{
		type: 'number',
		name: 'price',
		target: P,
		header: '상품 가격',
		other: 'placeholder="price" value="1000" autocomplete="price number"'
	},

	{ type: 'file', name: 'thumbnailBase64', target: P, header: '상품 썸네일 1MB 이하', other: '' },
	{ type: 'file', name: 'photoBase64', target: P, header: '상품 이미지 4MB 이하', other: '' }
];
const addFormInputEl = inputData.map(item => {
	const input = inputGenerate(item.name, item.target, item.other, item.type, item.header);
	if (item.name === 'id') {
		const newButton = document.createElement('button');
		newButton.classList = 'new-button';
		newButton.innerHTML = '새로운 제품 추가';

		newButton.addEventListener('click', e => {
			e.target.parentElement.querySelector('.id').value = '';
		});
		// parentElement 으로 인해 label 이 초기화 안되는건가? 평소엔 초기화됬다는거네

		input.querySelector('.id').parentElement.appendChild(newButton);
		// 아이디가 비어있으면 생성, 아이디가 들어있으면 수정
	}
	return input;
});
/**
 * Product-store 에 title, price, thumbnailBase64, imageBase64 , tags, description 을 추가함
 * 선택된 제품의 정보를 가져올 수 있어야함 (id)
 *
 * @returns {Element}
 */
export function render() {
	const component = document.createElement('div');
	component.classList.add('add-info');
	component.innerHTML = ``;
	productAddLayout(component);
	// 이 렌더러에서 만든 컴포넌트의 데이터를 받아올 수 있어야함

	return component;
}

//카테고리 영어로 category

/**
 * 삽입한 요소에 제작된 컴포넌트를 반환함
 * @param {Element} insertTarget
 */
function productAddLayout(insertTarget) {
	// 뒷 리스트
	const resultBox = document.createElement('div');
	resultBox.classList.add('result-box');
	resultBox.innerHTML = `<h1>제품 리스트</h1>`;
	const resultScroll = document.createElement('div');
	resultScroll.classList.add('result-scroll');

	// z-index 용 div
	const addWarp = document.createElement('div');
	addWarp.classList.add('add-warp');

	// 셀렉터
	const options = ['ALL', 'promotion', 'showcase', 'replica'];
	const selector = listRender('selector', options);

	addWarp.appendChild(selector);

	// input box
	const inputBox = document.createElement('div');
	const parentClass = insertTarget.className;
	inputBox.classList.add(`${parentClass}-box`);
	inputBox.innerHTML = '';

	function categoryEvent() {
		const menus = selector.children;

		for (const child of menus) {
			child.addEventListener('click', e => {
				e.target.parentNode.querySelectorAll('.on').forEach(e => e.classList.remove('on'));
				e.target.classList.toggle('on');

				P.category = e.target.innerText;

				const tagBox = document.querySelector('.add-info .option-box');
				// null 예외 처리
				if (tagBox) {
					tagBox.remove();
					const tagsParent = document.querySelector('.add-info');
					const tagsInput = tagDefault(child.innerText, resultScroll);

					tagsParent.prepend(tagsInput);
				} else {
					const tagsParent = document.querySelector('.add-info');
					const tagsInput = tagDefault(child.innerText, resultScroll);

					tagsParent.prepend(tagsInput);
				}
			});
		}
	}
	// UI 넣는 부분
	addFormInputEl.forEach(item => {
		inputBox.appendChild(item);
	});

	inputBox.append(
		textAreaGenerate(
			'description',
			P,
			'placeholder="제품 상세 정보 입력창" rows="2" cols="40" autocomplete="off"',
			'간단한',
			'상품 설명'
		)
	);

	//인풋 중 사진만 P로 저장하고 있다
	// 일단 getaddData는 ui를 읽어서 보내는 방법이다
	const submitBtn = document.createElement('button');
	submitBtn.innerText = '제출';

	submitBtn.addEventListener('click', async e => {
		const resultScroll = document.querySelector('.add-info .result-scroll');
		const selector = document.querySelector('.add-info .selector');
		const innerText = selector.querySelector('.on').innerText;
		const isId = inputBox.querySelector('.id').value;

		// 클릭 했을 때 id가 있으면 수정 없으면 추가
		const tagsRight = document.querySelector('.add-info .option-box .tags-right');
		const tags = tagsRight.querySelectorAll('li');
		const tagList = [];

		for (let i = 0; i < tags.length; i++) {
			if (tags[i].classList.contains('tag')) {
				const target = tags[i].querySelector('span.value');
				const value = target.innerText;
				tagList.push(value);
			}
		}
		const data = await getAddData(insertTarget);

		data.price = Number(data.price);
		data.tags = [...tagList];
		data.photoBase64 = P.photoBase64;
		data.thumbnailBase64 = P.thumbnailBase64;

		if (isId) {
			await editProduct(isId, JSON.stringify({ ...data }));
		} else {
			await productPost(JSON.stringify({ ...data }));
		}
		tagDefault(innerText, resultScroll);
	});
	inputBox.appendChild(submitBtn);
	addWarp.appendChild(inputBox);
	resultBox.appendChild(resultScroll);

	// 각 시스템 별 옵션
	insertTarget.appendChild(addWarp);
	insertTarget.appendChild(resultBox);
	categoryEvent();
}
