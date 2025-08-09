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

// Меняем тип попапа language если экран меньше 1151
if(w < 1151){
    const popupLanguage = document.getElementById('language');
    if(popupLanguage){
        popupLanguage.setAttribute("data-type", "centered");
        popupLanguage.classList.add("popup_centered");
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
}