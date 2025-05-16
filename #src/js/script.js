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

    @@include('_popup.js');

/** ======================================================================== */
/** =========== Прокрутка вверх / Плашка бонуса / Кнопка бонуса ============ */

let showBonuse = "box"; // btn | box
// Обработчик события прокрутки

function scrollForWelcomeBonus(scrollTop){
    // Показать/Скрыть блок бонуса
    if (scrollTop > 1000) {
        if(showBonuse === "box"){
            $('.js-welcomeBonus').show();
        }else{
            $('.js-btnBonus').show();
        }
        
    } else {
        $('.js-welcomeBonus').hide();
        $('.js-btnBonus').hide();
    }
}

// Закрыть плашку бонуса показать кнопку
$('.js-btnWelcomeBonusClose').click(function(){
    $('.js-welcomeBonus').hide();
    $('.js-btnBonus').show();
    showBonuse = "btn";
});

// Закрыть кнопку бонуса показать плашку
$('.js-btnBonus').click(function(){
    $('.js-btnBonus').hide();
    $('.js-welcomeBonus').show();
    showBonuse = "box";
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

