let wrapper = document.querySelector('.wrapper');
//Swiper
let pageSlider = new Swiper('.page', {
	// Свои классы
	wrapperClass: "page__wrapper",
	slideClass: "page__screen",
	// Вертикальный слайдер
	direction: 'vertical',
	// Включаем параллакс
	parallax: true,
	// Управление клавиатурой
	keyboard: {
		// Включить\выключить
		enabled: true,
		// Включить\выключить только когда слайдер в пределах вьюпорта
		onlyInViewport: true,
		// Включить\выключить управление клавишами pageUp, pageDown
		pageUpDown: true,
	},
	// Управление колесом мыши
	mousewheel: {
		// Чувствительность колеса мыши
		sensitivity: 1,
		// Класс объекта на котором будет срабатывать прокрутка мышью.
		//eventsTarget: ".screen",
	},
	// Отключение функционала если слайдов меньше чем нужно
	watchOverflow: true,
	// Скорость
	speed: 800,
	// Обновить свайпер при изменении элементов слайдера
	observer: true,
	// Обновить свайпер при изменении род. элементов слайдера
	observeParents: true,
	// Обновить свайпер при изменении дочерних элементов слайда
	observeSlideChildren: true,
	// Точки
	pagination: {
		el: '.page__pagination',
		type: 'bullets',
		clickable: true,
		bulletClass: "page__bullet",
		bulletActiveClass: "page__bullet_active",
	},
	// Скролл
	scrollbar: {
		el: '.page__scroll',
		dragClass: "page__drag-scroll",
		// Возможность перетаскивать скролл
		draggable: true
	},
	// Отключаем автоинициализацию
	init: false,
	// События
	on: {
		// Событие инициализации
		init: function () {
			menuSlider();
			setScrollType();
			wrapper.classList.add('_loaded');
		},
		// Событие смены слайда
		slideChange: function () {
			menuSliderRemove();
			menuLinks[pageSlider.realIndex].classList.add('_active');
		},
		resize: function () {
			setScrollType();
		}
	},
});

//===========================================================
let menuLinks = document.querySelectorAll('.menu__link');

function menuSlider() {
	if (menuLinks.length > 0) {
		menuLinks[pageSlider.realIndex].classList.add('_active');
		for (let index = 0; index < menuLinks.length; index++) {
			const menuLink = menuLinks[index];
			menuLink.addEventListener("click", function (e) {
				menuSliderRemove();
				pageSlider.slideTo(index, 800);
				menuLink.classList.add('_active');
				e.preventDefault();
			});
		}
	}
}

function menuSliderRemove() {
	let menuLinkActive = document.querySelector('.menu__link._active');
	if (menuLinkActive) {
		menuLinkActive.classList.remove('_active');
	}
}

function setScrollType() {
	if (wrapper.classList.contains('_free')) {
		wrapper.classList.remove('_free');
		pageSlider.params.freeMode = false;
	}
	for (let index = 0; index < pageSlider.slides.length; index++) {
		const pageSlide = pageSlider.slides[index];
		const pageSlideContent = pageSlide.querySelector('.screen__content');
		if (pageSlideContent) {
			const pageSlideContentHeight = pageSlideContent.offsetHeight;
			if (pageSlideContentHeight > window.innerHeight) {
				wrapper.classList.add('_free');
				pageSlider.params.freeMode = true;
				break;
			}
		}
	}
}

pageSlider.init();
//===========================================================
//Анимация цифрового счетчика
window.addEventListener("load", windowLoad);

function windowLoad() {
	//Функция инициализации
	function digitsCountersInit(digitsCountersItems) {
		let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
		if (digitsCounters) {
			digitsCounters.forEach(digitsCounter => {
				digitsCountersAnimate(digitsCounter);
			});
		}
	}
	//Функция анимации
	function digitsCountersAnimate(digitsCounter) {
		let startTimestamp = null;
		const duration = parseInt(digitsCounter.dataset.digitsCounter) ? parseInt(digitsCounter.dataset.digitsCounter) : 1000;
		const startValue = parseInt(digitsCounter.innerHTML);
		const startPosition = 0;
		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
			if (progress < 1) {
				window.requestAnimationFrame(step);
			}
		};
		window.requestAnimationFrame(step);
	}
	//Пуск при загрузке страницы
	//digitsCountersInit();

	//Пуск при скролле
	let options = {
		threshold: 0.3 //% появления объекта
	}
	let observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const targetElement = entry.target;
				const digitsCountersItems = targetElement.querySelectorAll("[data-digits-counter]");
				if (digitsCountersItems.length) {
					digitsCountersInit(digitsCountersItems);
				}
				//Выкл. отслеживание после срабатывания
				//observer.unobserver(targetElement);
			}
		});
	}, options);
	let sections = document.querySelectorAll('.page__screen');
	if (sections.length) {
		sections.forEach(section => {
			observer.observe(section);
		});
	}
}