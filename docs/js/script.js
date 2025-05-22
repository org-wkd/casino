document.addEventListener('DOMContentLoaded', function () {
	let w = window.outerWidth;
    const isMobile = 'ontouchstart' in window;
    const BREAKPOINT_md3 = 767.98;

    window.addEventListener('scroll', handleScroll, { passive: true });

    /** ======================================================================== */
/** ====================== Группа скриптов для попапов ===================== */

const popups = document.querySelectorAll('.popup');
let lastOpenedPopupID = null;

// Показать попапы при клике
document.addEventListener("click", function(e) {
	const opener = e.target.closest('.js-popup-opener');
	if (!opener) return;

	e.preventDefault();

	if (opener.classList.contains('disabled')) return false;

	const popupID = opener.dataset.popupId;
	const additionalClass = opener.dataset.addClass;
	const triggerRect = opener.getBoundingClientRect();

	openPopup(popupID, triggerRect, additionalClass);
});

// Открыть попап
function openPopup(popupID, triggerRect, additionalClass) {
	if (lastOpenedPopupID !== popupID) {
		if (lastOpenedPopupID !== null) close_popup();
		lastOpenedPopupID = popupID;

		let additionalClassName = additionalClass ? ` ${additionalClass}` : "";

		const popupEl = document.getElementById(popupID);
		if (!popupEl) return;

		if (popupID === "problem") {
			initProblemPopup?.(); // вызывается, если есть такая функция
		}

		if (w > BREAKPOINT_md3) {
			const type = popupEl.dataset.type;

			if (type === 'centered') {
				document.querySelector(".js-popupOverlay")?.classList.add("active");
				bodyLock();
			} else {
				const modalRect = popupEl.getBoundingClientRect();
				const isRtl = document.documentElement.getAttribute("dir") === "rtl";

				let top = 0, left = 0;
				if (popupID === "language") {
					top = additionalClass === undefined
						? triggerRect.top + triggerRect.height + 8
						: window.scrollY + triggerRect.top - modalRect.height - 8;
					left = isRtl
						? triggerRect.left
						: triggerRect.left + triggerRect.width - 360;
				}

				Object.assign(popupEl.style, {
					top: `${top}px`,
					left: `${left}px`
				});
			}
		} else {
			document.querySelector(".js-popupOverlay")?.classList.add("active");
			bodyLock();
		}

		popupEl.classList.add("isOpen");
	} else {
		close_popup();
	}
}

// Закрытие по клику вне
document.addEventListener(isMobile ? "touchend" : "mousedown", function(e) {
	const isClickInsidePopup = [...popups].some(popup => popup.contains(e.target));
	const isOpener = e.target.closest('.js-popup-opener');
	const popupIsOpen = [...popups].some(popup => popup.classList.contains('isOpen'));

	if (!isClickInsidePopup && !isOpener && popupIsOpen) {
		close_popup();
	}
});

// Закрытие по Esc
document.addEventListener("keydown", function(e) {
	if (e.key === "Escape" || e.keyCode === 27) {
		close_popup();
	}
});

// Закрытие по кнопке
document.addEventListener("click", function(e) {
	const closer = e.target.closest('.js-popup-closer');
	if (!closer) return;
	e.preventDefault();
	close_popup();
});

// Блокировка/разблокировка скролла
function bodyLock() {
	document.body.classList.add('lock');
}

function bodyUnLock() {
	document.body.classList.remove('lock');
}

// Закрыть попап
function close_popup() {
	popups.forEach(p => p.classList.remove('isOpen', 'mod2'));
	document.querySelector(".js-popupOverlay")?.classList.remove("active");
	bodyUnLock();
	lastOpenedPopupID = null;
};

/** ======================================================================== */
/** =========== Прокрутка вверх / Плашка бонуса / Кнопка бонуса ============ */

let showBonuse = "box"; // btn | box

// Обработчик события прокрутки
function scrollForWelcomeBonus(scrollTop) {
	if (scrollTop > 1000) {
		if (showBonuse === "box") {
			document.querySelectorAll('.js-welcomeBonus').forEach(el => el.style.display = 'block');
		} else {
			document.querySelectorAll('.js-btnBonus').forEach(el => el.style.display = 'block');
		}
	} else {
		document.querySelectorAll('.js-welcomeBonus').forEach(el => el.style.display = 'none');
		document.querySelectorAll('.js-btnBonus').forEach(el => el.style.display = 'none');
	}
}

// Закрыть плашку бонуса, показать кнопку
document.querySelectorAll('.js-btnWelcomeBonusClose').forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelectorAll('.js-welcomeBonus').forEach(el => el.style.display = 'none');
		document.querySelectorAll('.js-btnBonus').forEach(el => el.style.display = 'block');
		showBonuse = "btn";
	});
});

// Закрыть кнопку бонуса, показать плашку
document.querySelectorAll('.js-btnBonus').forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelectorAll('.js-btnBonus').forEach(el => el.style.display = 'none');
		document.querySelectorAll('.js-welcomeBonus').forEach(el => el.style.display = 'block');
		showBonuse = "box";
	});
});

/** ======================================================================== */
/** ================================ Прочее ================================ */

// Плашка "Cookie"
(function () {
	// Показать плашку через 11 секунд после загрузки, если ещё не была показана
	setTimeout(() => {
		const cookie = localStorage.getItem('cookie');
		if (cookie === null) {
			const cookieBanner = document.querySelector('.cookie');
			if (cookieBanner) {
				cookieBanner.style.display = 'block';
				cookieBanner.style.transition = 'all 150ms ease';
				requestAnimationFrame(() => {
					cookieBanner.style.opacity = '1';
				});
			}
		}
	}, 11000);

	// Скрыть плашку
	document.querySelectorAll('.js-btn-cookie').forEach(btn => {
		btn.addEventListener('click', () => {
			const cookieBanner = document.querySelector('.cookie');
			if (cookieBanner) {
				cookieBanner.style.opacity = '0';
				setTimeout(() => {
					cookieBanner.style.display = 'none';
				}, 150);
				localStorage.setItem('cookie', 'true');
			}
		});
	});
})();

// При клике, закрываем ошибки input полей выводимые попапами
document.addEventListener('click', function () {
	const tips = document.querySelectorAll('.subscribe .wpcf7-not-valid-tip');
	tips.forEach(tip => tip.remove());

	const inputs = document.querySelectorAll('.subscribe .wpcf7-form-control-wrap input');
	inputs.forEach(input => input.classList.remove('wpcf7-not-valid'));
});

// Актуальный год в футере
(function () {
	const now = new Date();
	const year = now.getFullYear();

	document.querySelectorAll('.js-current-year').forEach(el => {
		el.textContent = year;
	});
})();

// Burger menu
(function () {
    const btn = document.querySelector('.js-burger-btn');
    const menu = document.querySelector('.js-menu');
    const overlay = document.querySelector('.js-bgOverlay');

    btn.addEventListener('click', openMenu);
    overlay.addEventListener('click', closeMenu);
    overlay.addEventListener('touchmove', closeMenu, { passive: true });

    function closeMenu() {
        btn.classList.remove('active');
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.documentElement.style.overflow = "";
    }

    function openMenu() {
        btn.classList.add('active');
        menu.classList.add('active');
        overlay.classList.add('active');
        document.documentElement.style.overflow = "hidden";
    }
})();

// Превращает картинку data-bg-image в background-image
(function ibg(){
	setTimeout(() => {
		document.querySelectorAll('.js-ibg').forEach(function(element) {
			const bgUrl = element.getAttribute('data-bg-image');
			element.style.backgroundImage = `url(${bgUrl})`;
		});
	}, 0);
})();

const header = document.querySelector('.js-header');
// Добавляем header-у класс active если проскролено хоть немного 
function scrollForHeader(scrollTop){
    header.classList.toggle('active', scrollTop > 0);
}

// Функции зависящиеот скролла
function handleScroll() {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	scrollForWelcomeBonus(scrollTop);
	scrollForHeader(scrollTop);
}
handleScroll();

/** ======================================================================== */
    
});

