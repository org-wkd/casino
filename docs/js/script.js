document.addEventListener('DOMContentLoaded', function () {
	let w = window.innerWidth;
    const isMobile = 'ontouchstart' in window;
    const BREAKPOINT_md3 = 767.98;
	const BREAKPOINT_md4 = 479.98;

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

// Если это страница казино, подсветить доступные страны
const globalMap = document.querySelectorAll('.js-map-global-availability');
if (globalMap.length === 1) {
	const mapElement = globalMap[0]; // так как их точно один
	countryAvailability.forEach(function(id) {
		const country = mapElement.querySelector('#country-' + id);
		if (country) {
			country.setAttribute('fill', '#34C759');
		}
	});
}

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
		document.querySelectorAll('.js-ibg-fScreen').forEach(function(element) {
			const bgUrl = element.getAttribute(w > BREAKPOINT_md4 ? 'data-bg-desc' : 'data-bg-mob');
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

// Подгрузка контента по клику на табы
document.querySelectorAll('.tab').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();

	// Класс active у текущего активного таба
	document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    link.classList.add('active');

	// Загрузка контента
    const url = link.getAttribute('href');

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Ошибка загрузки');

      const html = await res.text();
      document.getElementById('js-tab-content').innerHTML = html;
    } catch (err) {
      console.error(err);
      document.getElementById('js-tab-content').innerHTML = '<p>Ошибка загрузки</p>';
    }
  });
});

// Форма в попапе "Language"
document.querySelectorAll('.js-form-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();

        const value = this.dataset.value;
        const form = this.closest('.js-form');

        form.querySelector('.js-form-value').value = value;
        form.submit();

        close_popup();
    });
});

// Копирование текста в буфер обмена
(function () {
  // Копировать в буфер
  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  // Клик на скопировать ссылку
  const buttons = document.querySelectorAll(".js-copy-text");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const text = button.dataset.promocode;
      copyToClipboard(text);

      const copiedElement = document.querySelector(".js-copied");

      if (copiedElement) {
        copiedElement.classList.add("show");

        setTimeout(() => {
          copiedElement.classList.remove("show");
          copiedElement.classList.add("hide");

          setTimeout(() => {
            copiedElement.classList.remove("hide");
          }, 280);
        }, 2000);
      }
    });
  });
})();

/** ======================================================================== */
    
});

