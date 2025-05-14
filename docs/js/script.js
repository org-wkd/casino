$(document).ready(function () {
	var w = $(window).outerWidth();
	var h = $(window).outerHeight();
	var isMobile = ('ontouchstart' in window);
	const $body = $('body');
	const BREAKPOINT_md1 = 1343;
	const BREAKPOINT_1045 = 1044.98;
	const BREAKPOINT_md2 = 992.98;
	const BREAKPOINT_872 = 871.98;
	const BREAKPOINT_md3 = 767.98;
	const BREAKPOINT_552 = 551.98;
	const BREAKPOINT_md4 = 479.98;

    $(window).scroll(handleScroll);

    /** ======================================================================== */
/** ====================== Группа скриптов для попапов ===================== */

var popup = $(".popup");
var lastOpenedPopupID = null;

// Показать попапы при клике
$(document).on("click", ".js-popup-opener", function(e){
	e.preventDefault();
	if($(this).hasClass('disabled')){return false;}
	const triggerRect = this.getBoundingClientRect();
	openPopup($(this).data('popup-id'), triggerRect, $(this).data('add-class'));
});

// Открыть попап
function openPopup(popupID, triggerRect, additionalClass) {
	if(lastOpenedPopupID !== popupID){
		if(lastOpenedPopupID !== null){close_popup();}
		lastOpenedPopupID = popupID;

		let additionalClassName = "";

		if(popupID == "problem"){initProblemPopup();}

		if(w > BREAKPOINT_md3){
			additionalClassName = additionalClass === undefined ? "" : " "+additionalClass;
			
			// Определить тип попапа (Плавающий | floating) или (Центрированый | centered)
			let type = $('#'+popupID).data('type');
			if(type == 'centered'){
				$(".js-popupOverlay").addClass('active');
				bodyLock();
			}else{
				let modalRect = $('#'+popupID)[0].getBoundingClientRect();
				let isRtl = $('html').attr('dir') === 'rtl';

				let top = 0, left = 0;
				if(popupID === "language"){
					top = additionalClass === undefined ? triggerRect.top + triggerRect.height + 8 
						: document.documentElement.scrollTop + triggerRect.top - modalRect.height - 8;
					left = isRtl ? triggerRect.left : triggerRect.left + triggerRect.width - 360;
				}

				$('#'+popupID).css({
					'top': top+"px",
					'left': left+"px"
				});
			}
		}else{
			$(".js-popupOverlay").addClass('active');
			bodyLock();
		}

		$('#'+popupID).addClass('isOpen'+additionalClassName);
	}else{
		close_popup();
	}
}

// Скрыть попапы при клике вне попапа и вне области вызова попапа
$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
	var popupTarget = $(".js-popup-opener").has(e.target).length;
	// Если (клик вне попапа && попап имеет класс isOpen)
    if (popup.has(e.target).length === 0 && popup.hasClass('isOpen') && popupTarget === 0 && $(e.target).hasClass('js-popup-opener') === false){
	    close_popup();
	}
});

// Скрыть попап при нажатии на клавишу "Esc"
$(document).on("keydown", function (e) {
	if(e.which === 27){
		close_popup();
	}
});

// Блокировка скролла при открытии попапа
function bodyLock() {
	$body.addClass('lock');
}

// Разблокировка скролла при закрытии попапа
function bodyUnLock() {
	$body.removeClass('lock');
}

// Закрыть popup
function close_popup() {
	$(".popup").removeClass('isOpen mod2');
	$(".js-popupOverlay").removeClass('active');
	bodyUnLock();
	lastOpenedPopupID = null;
}

// Закрыть попапа при нажатии на кнопки "Close"
$(document).on("click", ".js-popup-closer", function(e){
	e.preventDefault();
	close_popup();
});;
    const animItems = document.querySelectorAll("._anim-items"); // Элементы которые нужно анимировать
if(animItems.length > 0){
	window.addEventListener('scroll', animOnScroll);
	/* Что происходит: Для каждого элемента который имеет класс '_anim-items' при достижении 1/4 его
	высоты, либо 1/4 высоты окна браузера(если высота объекта выше высоты окна браузера) ему 
	добавляется класс '_active'. Если мы недокрутили до елемента, либо перекрутили то у него класс
	'_active' убирается. */
	function animOnScroll() {
		for(let index = 0; index < animItems.length; index++){ 
			const animItem = animItems[index]; // Получаем каждый объект отдельно
			const animItemHeight = animItem.offsetHeight; // Получаем высоту объекта
			const animItemOffset = offset(animItem).top; // Позиция объекта относительно верха
			const animStart = 4; // Коэффициент резулирующий момент старта анимации

			// Настройка момента старта анимации
			let animItemPoint = window.innerHeight - animItemHeight / animStart;

			// Для случая когда анимированный объект выше по высоте чем окно браузера
			if(animItemHeight > window.innerHeight){
				animItemPoint = window.innerHeight - window.innerHeight / 4;
			}

			// Добавляем элементам класс при определенных условиях
			if((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)){
				animItem.classList.add('_active');
			}else{ // Убрать класс нужно для повторной анимации объекта
				/* Наличие у объекта класса '_anim-no-hide' говорит о том что не нужно объект  
				повторно анимировать если опять на него проскролили */
				if(!animItem.classList.contains('_anim-no-hide')){
					animItem.classList.remove('_active');
				}
			}
		}
	}
	function offset(el) {// Корректно и кроссбраузерно выщитывает позиция объекта относительно верха
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return {top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}

	setTimeout(function() {
		animOnScroll();
	}, 300);
};

/** ======================================================================== */
/** =========== Прокрутка вверх / Плашка бонуса / Кнопка бонуса ============ */

let showBonuse = "box"; // btn | box
// Обработчик события прокрутки

function scrollForWelcomeBonus(scrollTop){
    // Показать/Скрыть кнопку прокрутки "Вверх"
    if (scrollTop > 500) {
        $('.js-btnScrollToTop').show();
    } else {
        $('.js-btnScrollToTop').hide();
    }

    // Показать/Скрыть блок бонуса
    if (scrollTop > 1000) {
        if(showBonuse === "box"){
            $('.js-welcomeBonus').show();
            $('.js-btnScrollToTop').addClass('hasBoxWelcomeBonus');
        }else{
            $('.js-btnBonus').show();
        }
        
    } else {
        $('.js-welcomeBonus').hide();
        $('.js-btnScrollToTop').removeClass('hasBoxWelcomeBonus');
        $('.js-btnBonus').hide();
    }
}

// Закрыть плашку бонуса показать кнопку
$('.js-btnWelcomeBonusClose').click(function(){
    $('.js-welcomeBonus').hide();
    $('.js-btnScrollToTop').removeClass('hasBoxWelcomeBonus');
    $('.js-btnBonus').show();
    showBonuse = "btn";
});

// Закрыть кнопку бонуса показать плашку
$('.js-btnBonus').click(function(){
    $('.js-btnBonus').hide();
    $('.js-welcomeBonus').show();
    $('.js-btnScrollToTop').addClass('hasBoxWelcomeBonus');
    showBonuse = "box";
});

// Прокрутить вверх
$('.js-btnScrollToTop').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 'smooth');
    return false;
});

/** ======================================================================== */
/** ================================ Прочее ================================ */

// Плашка "Cookie"
(function () {
    // Показать плашку через 11 сек после загрузки если еще небыла показана
    setTimeout(function(){
        let cookie = localStorage.getItem('cookie');
        if(cookie == null){
            $('.cookie').slideDown(150);
        }
    }, 11000);

    // Скрыть плашку
    $('.js-btn-cookie').click(function(){
        $('.cookie').slideUp(150);
        localStorage.setItem('cookie', 'true');
    });
})();

// Актуальный год в футере
(function(){
    let now = new Date;
    let year = now.getFullYear();
    $('.js-current-year').text(year);
})();

// При клике, закрываем ошибки input полей выводимые попапами
$(document).on('click', function(event) {
    $('.subscribe .wpcf7-not-valid-tip').remove();
    $('.subscribe .wpcf7-form-control-wrap input').removeClass('wpcf7-not-valid');
});

// Burger menu
(function () {
    const btn = document.querySelector('.js-burger-btn');
    const menu = document.querySelector('.js-menu');
    const overlay = document.querySelector('.js-bgOverlay');

    btn.addEventListener('click', openMenu);
    overlay.addEventListener('click', closeMenu);
    overlay.addEventListener('touchmove', closeMenu);

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
    document.querySelectorAll('.js-ibg').forEach(function(element) {
        const bgUrl = element.getAttribute('data-bg-image');
        element.style.backgroundImage = `url(${bgUrl})`;
    });
})();

const header = document.querySelector('.js-header');
// Добавляем header-у класс active если проскролено хоть немного 
function scrollForHeader(scrollTop){
    header.classList.toggle('active', scrollTop > 0);
}

// Функции зависящиеот скролла
function handleScroll() {
    let scrollTop = $(this).scrollTop();
    scrollForWelcomeBonus(scrollTop);
    scrollForHeader(scrollTop);
}
handleScroll();

/** ======================================================================== */
    
});

