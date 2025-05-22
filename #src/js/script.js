document.addEventListener('DOMContentLoaded', function () {
	let w = window.innerWidth;
    const isMobile = 'ontouchstart' in window;
    const BREAKPOINT_md3 = 767.98;
	const BREAKPOINT_md4 = 479.98;

    window.addEventListener('scroll', handleScroll, { passive: true });

    @@include('_popup.js');

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

/** ======================================================================== */
    
});

