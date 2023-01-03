import Swiper from 'swiper';
import { store, product } from '../utils/store';

import { allSearch, textSearch, detailInfo } from '../product-data/product-api';
import { numTostring, swiperGenerate } from '../utils/useful';

async function promotionForm(item, number) {
	await allSearch();
	let showcase = await textSearch('showcase', `${item.id}`);

	await detailInfo(item.id);

	let start = new Date(item.tags[2]);
	let end = new Date(item.tags[3]);

	let now = new Date();
	let gap = end.getTime() - now.getTime();
	start = new Intl.DateTimeFormat('ko-KR').format(start);
	end = new Intl.DateTimeFormat('ko-KR').format(end);
	let d = Math.floor(gap / (1000 * 60 * 60 * 24));
	let h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

	const From = document.createElement('section');
	From.className = 'promotion-section';
	//자릿수 맞추기
	From.style.backgroundImage = `url(${product.temp.photo})`;

	From.innerHTML = `
  <div class="promotion-top">
  <div class="promotion-top-left">
    <img src="${item.thumbnail}" alt="" />
  </div>
  <div class="promotion-top-right">
    <ul class="tags"><li class="tag">${item.tags[4]}</li><li class="tag">${item.tags[5]}</li></ul>
    <div class="title">${item.title}</div>
    <div class="price">시작가 ${item.price.toLocaleString()}원</div>
    <div class="remain">${d}일 ${h} 시간 남음</div>
    <div class="date">기간 : ${start} ~ ${end}</div>

    <div class="description">${item.description}</div>
    

  </div>
  </div>
  <div class="promotion-bottom">
  <div class="swiper mySwiper${number}">
      <div class="swiper-wrapper">
          //product
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
  `;
	// 프로모션이 붙은 아이템 갯수만큼 만들어서 넣어줘야한다
	// 특정 아이디를 가진 show case 데이터를 뿌려줘야한다
	// 그거에 이벤트도 넣어서 반환한다음 프로모션에 넣어줘야한다
	// 그리고 프로모션에는 스와이퍼를 넣었다
	// 일단 store.all 로 땜빵

	const caseList = showcase.map(data => {
		const art = document.createElement('div');
		art.className = 'swiper-slide';
		art.innerHTML = `<div class="showcase">
    <div class="thumbnail"><img src="${data.thumbnail}"/></div>
    <div class="title">${data.title}</div>
    <div class="price">현재가 ${data.price}원</div>
    <ul class="tags"><li class="tag">${data.tags[4]}</li><li class="tag">${data.tags[5]}</li></ul>
  </div>
  <div class="timer-box">
    <p class="timer-msg">남은 시간<span></span></p>
    <p class="timer">18:27:36</p>
  </div>`;

		art.addEventListener('click', () => {
			const id = data.id;
		});
		// 이벤트 메모리 관리 어떻게 해야할지 모르겠지만 일단 건너뛰고 작업

		const timeInterval = setInterval(() => {
			// 임시로 현재 시간 + 3시간으로 설정
			const now = new Date(data.tags[2]);
			const end = new Date();
			end.setDate(now.getDate() + Number(data.tags[3]));

			const gap = end.getTime() - now.getTime();
			const d = Math.floor(gap / (1000 * 60 * 60 * 24));
			const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
			const s = Math.floor((gap % (1000 * 60)) / 1000);
			const time = `${d}일 ${h}시간 ${m}분 ${s}초`;
			art.querySelector('.timer').innerText = time;
			if (gap < 0) {
				clearInterval(timeInterval);
				art.querySelector('.timer').innerText = '경매 종료';
			}
		}, 1000);

		return art;
	});
	From.querySelector('.swiper-wrapper').innerHTML = '';
	From.querySelector('.swiper-wrapper').append(...caseList);

	return From;
}

export async function promotionGenerate() {
	const promotion = await textSearch('promotion');
	promotion.sort((a, b) => a.tags[1] - b.tags[1]);
	let result = promotion.map((item, index) => {
		const number = numTostring(index + 1);
		const el = promotionForm(item, number);
		return el;
	});
	//`.mySwiper${number}`

	result = await Promise.all(result).then(res => {
		return res;
	});
	return result;
}
