import P from '../product-data/product-store';
import Swiper from 'swiper';

/**
 *선택한 컴포넌트 안에서 클래스명이 일치하는 요소들을 찾아서 객체로 반환한다
 */
export async function getAddData(component) {
	let addData = {};

	const classes = ['title', 'price', 'description'];
	classes.forEach(target => {
		const item = component.querySelector(`.add-info-box .${target}`);

		if (item.type === 'file' && item.files.length > 0) {
			const imgResult = item.nextElementSibling.src;

			addData[target] = imgResult;
		} else if (item.value !== '') {
			addData[target] = item.value;
		}
	});
	return addData;
}

const debounce = (func, delay = 0) => {
	let inDebounce;
	return function (...rest) {
		clearTimeout(inDebounce);
		inDebounce = setTimeout(() => func.apply(this, rest), delay);
	};
};

const throttle = (func, delay = 0) => {
	let lastFunc;
	let lastRan;
	return function (...rest) {
		if (!lastRan) {
			func.apply(this, rest);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(() => {
				if (Date.now() - lastRan >= delay) {
					func.apply(this, rest);
					lastRan = Date.now();
				}
			}, delay - (Date.now() - lastRan));
		}
	};
};
/**
 *
 * @param {string} buttonName
 * @param {function} func
 * @returns {HTMLButtonElement}
 */
export function ButtonGenerate(buttonName, func) {
	// 참조형으로 저장했고 이걸 그대로 return 하면 참조형으로 return 된다
	//const button = document.createElement('button');

	const button = document.createElement('button');
	button.classList.add(buttonName);
	button.innerHTML = buttonName;

	button.addEventListener('click', func);
	return button;
}

export function inputGenerate(text, targetStore, other, type, header) {
	const inputBox = document.createElement('label');
	//inputBox.classList.add(text);
	inputBox.innerHTML = `${header}
<input type="${type}" class="${text}" alt="${text}"  ${other}/><img class ="${text}" src=""/>`;

	if (type === 'file') {
		const reset = () => {};

		const reader = new FileReader();

		reader.onload = () => {
			targetStore[text] = reader.result;
			inputBox.querySelector(`img.${text}`).src = reader.result;
		};

		if (text === 'thumbnailBase64') {
			inputBox.addEventListener('change', event => {
				const file = event.target.files[0];
				if (file.size / 1024 / 1024 < 1) {
					reader.readAsDataURL(file);
				} else {
					alert('파일 사이즈가 너무 큽니다');
					event.target.value = '';
				}
			});
		} else if (text === 'photoBase64') {
			inputBox.addEventListener('change', event => {
				const file = event.target.files[0];
				if (file.size / 1024 / 1024 < 4) {
					reader.readAsDataURL(file);
				} else {
					alert(`${file.size / 1024 / 1024}상품 이미지 사이즈가 너무 큽니다`);
					event.target.value = '';
				}
			});
		}
	}

	return inputBox;
}

export function textAreaGenerate(text, targetStore, other, inner, header) {
	const inputBox = document.createElement('label');
	//inputBox.classList.add(text);
	inputBox.innerHTML = `${header}
<textarea class="${text}" alt="${text}"  ${other}>
${inner}</textarea>`;

	inputBox.addEventListener(
		'keydown',
		throttle(event => {
			targetStore[text] = event.target.value;

			if (event.target.rows >= 1) {
				event.target.rows = Math.floor((event.target.value.length / event.target.cols) * 2) + 2;
			}
		}, 500)
	);

	return inputBox;
}

export function queryRemove(text) {
	const dom = document.querySelector(text);
	dom.remove();
}

export function defaultRender() {
	const mainContainer = document.querySelector('main');
	mainContainer.innerHTML = '';
	const header = document.querySelector('header');
	header.innerHTML = '';
	const footer = document.querySelector('footer');
	footer.innerHTML = '';
}

export function listRender(text, options) {
	const selector = document.createElement('ul');
	selector.classList.add(text);

	options.forEach(option => {
		const li = document.createElement('li');
		li.classList.add(option);
		li.innerText = option;
		selector.appendChild(li);
	});
	return selector;
}

export function modalGenerate() {
	const inputBox = document.createElement('div');
	inputBox.classList.add('backdrop');
	Object.assign(inputBox.style, {
		position: 'fixed',
		display: 'flex',
		justifyContent: 'center',
		paddingLeft: '16px',
		alignItems: 'center',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		backgroundColor: 'rgba(0,0,0,0.3)',
		'z-index': 999
	});

	inputBox.addEventListener('click', function handler(e) {
		if (e.target.classList.contains('backdrop') === false) return;

		inputBox.remove();
		inputBox.removeEventListener('click', handler);
	});

	return inputBox;
}

function getChildIndex(child) {
	// child의 parentNode 속성을 사용해서 부모 요소를 가져옵니다.
	const parent = child.parentNode;
	// 부모 요소의 children 속성을 사용해서 자식 요소들을 가져옵니다.
	const children = parent.children;
	// 자식 요소들을 순서대로 저장한 HTMLCollection 객체를 배열로 변환합니다.
	// 이렇게 하면 Array.prototype.indexOf 메소드를 사용할 수 있습니다.

	const childrenArray = [...children];

	// child 요소의 인덱스를 찾습니다.
	const index = childrenArray.indexOf(child);
	// 인덱스를 반환합니다.

	return index;
}

export function tagRender(text) {
	let guideHandler = {
		timer: false
	};

	const tagContainer = document.createElement('li');
	tagContainer.classList.add('tag');
	tagContainer.innerHTML = `<span class="value">${text}</span><span class="delete"><i class="fa-solid fa-xmark"></i></span>`;

	tagContainer.querySelector('.delete').addEventListener('click', function handler(e) {
		e.currentTarget.parentNode.remove();
		e.currentTarget.parentNode.removeEventListener('click', handler);
	});
	tagContainer.addEventListener('click', function handler(e) {
		// 클릭한 거의 부모에 delete 클래스가 있으면 삭제
		const deleteTrigger = e.target.closest('.delete');
		const focusTrigger = e.target.closest('li.tag');
		const tagsNum = getChildIndex(focusTrigger);

		if (deleteTrigger) {
			e.currentTarget.remove();
			e.currentTarget.removeEventListener('click', handler);
		} else if (focusTrigger) {
			if (tagsNum > 3) {
				const focusTarget = focusTrigger.querySelector('.value');
				const inputEl = document.createElement('input');
				inputEl.value = focusTarget.innerText;

				focusTrigger.replaceChild(inputEl, focusTarget);
				inputEl.focus();
				inputEl.addEventListener('blur', function handler(e) {
					const resultEl = tagRender(inputEl.value);
					focusTrigger.parentNode.replaceChild(resultEl, focusTrigger);
					focusTrigger.removeEventListener('blur', handler);
				});
				inputEl.addEventListener('keydown', function handler(e) {
					if (e.key === 'Enter') {
						inputEl.blur();
					}
				});
			} else if (tagsNum === 0) {
				const target = document.querySelector('.add-warp .selector');

				if (guideHandler.timer === false) {
					guideHandler = containerGuide(target);
				}
			} else if (tagsNum === 1) {
				const target = document.querySelector('.option-box .layout-order');
				target.focus();
				if (guideHandler.timer === false) {
					guideHandler = containerGuide(target.parentElement);
				}
			} else if (tagsNum === 2) {
				const target = document.querySelector('.option-box .start');
				target.focus();
				if (guideHandler.timer === false) {
					guideHandler = containerGuide(target.parentElement);
				}
			} else if (tagsNum === 3) {
				const target = document.querySelector('.option-box .end');
				target.focus();
				if (guideHandler.timer === false) {
					guideHandler = containerGuide(target.parentElement);
				}
			}
		}
	});
	return tagContainer;
}

/**
 * 지목하고 싶은 요소에 가이드를 띄워줍니다.
 * @param {HTMLDivElement} el
 */
export function containerGuide(el) {
	el.style.position = 'relative';

	const guideStyle = {
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		top: '0',
		left: '0',
		width: '100%',
		height: '100%',
		zIndex: '999'
	};

	const guideBorderType = {
		border: '3px solid #ffcccc',
		borderRadius: '4px'
	};

	const guide = document.createElement('div');
	guide.classList.add('guide');
	Object.assign(guide.style, guideStyle);
	Object.assign(guide.style, guideBorderType);

	el.appendChild(guide);

	const control = {
		timer: true
	};

	let deleteTimer = setTimeout(function () {
		guide.remove();
		control.timer = false;
		clearTimeout(deleteTimer);
	}, 3000);

	return control;
}

let removeToast;

export function toast(string) {
	const toast = document.getElementById('toast');
	toast.classList.contains('show')
		? (clearTimeout(removeToast),
		  (removeToast = setTimeout(function () {
				toast.classList.remove('show');
		  }, 2000)))
		: (removeToast = setTimeout(function () {
				toast.classList.remove('show');
		  }, 2000));
	toast.classList.add('show'), (toast.innerText = string);
}

export function numTostring(num) {
	if (num < 10) {
		return `0${num}`;
	} else {
		return `${num}`;
	}
}

export function swiperGenerate(number) {
	// 스와이퍼에 엘리먼트를 넣을 수 있다
	return new Swiper(`.mySwiper${number}`, {
		slidesPerView: 4,
		spaceBetween: 30,

		//loop: true, 복제된 요소에 이벤트를 걸어야 한다면 루프를 사용하면 안된다 음..

		pagination: {
			el: '.swiper-pagination',
			clickable: true
		},
		autoplay: {
			delay: 2500
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		}
	});
}

export const hr = () => {
	const hr = document.createElement('hr');
	return hr;
};

export const PromotionData = [
	{
		type: 'number',
		name: 'layout-order',
		target: '',
		header: '레이아웃 순서',
		other: 'min="1" max="100"'
	},
	{
		type: 'datetime-local',
		name: 'start',
		target: '',
		header: '시작 시간',
		other: ''
	},
	{
		type: 'datetime-local',
		name: 'end',
		target: '',
		header: '끝 시간',
		other: ''
	}
];
export const showCaseData = [
	{
		type: 'text',
		name: 'layout-order',
		target: '',
		header: '프로모션 제품',
		other: ''
	},
	{
		type: 'datetime-local',
		name: 'start',
		target: '',
		header: '시작 시간',
		other: ''
	},
	{
		type: 'number',
		name: 'end',
		target: '',
		header: '경매 시간 ( hour )',
		other: 'min="0"'
	}
];
