$(document).ready(() => {
    'use strict';
    new WOW({
        animateClass: 'animate__animated',
    }).init();
    document.getElementById('burger').onclick = function () {
        document.getElementById('menu').classList.add('open');
    }
    document.querySelectorAll('#menu *').forEach((item) => {
        item.onclick = () => {
            document.getElementById('menu').classList.remove('open');
        }
    })

    $('#Orchridariums').click(function () {
        $('#itemsFlorariums').css('display', 'none');
        $('#itemsOrchridariums').removeAttr('style');
    })
    $('#Florariums').click(function () {
        $('#itemsOrchridariums').css('display', 'none');
        $('#itemsFlorariums').removeAttr('style');
    })


        $('.gallery-popup').magnificPopup({
            type: 'image', // тип контента - изображение
            gallery: {
                enabled: true // включаем режим галереи (возможность переключаться между изображениями)
            },
            image: {
                titleSrc: function (item) {
                    // Отображаем альтернативный текст в качестве заголовка
                    return item.el.children('img').attr('alt');
                }
            },

            removalDelay: 300,
            mainClass: 'mfp-fade',

            closeOnContentClick: true,
            closeBtnInside: false
        });



    $('.autoplay').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,    // Интервал 5 секунд
        prevArrow: '<button type="button" class="slick-prev"><svg viewBox="0 0 15 30"><path d="M12 30L0 15L12 0" fill="none" stroke="#808080" stroke-width="2"/></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg viewBox="0 0 15 30"><path d="M3 0L15 15L3 30" fill="none" stroke="#808080" stroke-width="2"/></svg></button>',
        dots: true,
        arrows: true,           // Добавим стрелки
        pauseOnHover: false,    // Не останавливать при наведении
        speed: 300,             // Скорость анимации перехода 0.3 сек
        cssEase: 'ease-in-out', // Плавное ускорение/замедление
        responsive: [{
            breakpoint: 768,
            settings: {
                dots: false,
                slidesToShow: 2     // Показывать 2 слайда на мобильных
            }
        }, {
            breakpoint: 480,
            settings: {
                dots: false,
                slidesToShow: 1    // 1 слайд на маленьких экранах
            }
        }]
    });

    $('.popup-with-zoom-anim').magnificPopup({
        type: 'inline',
        fixedContentPos: false,
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in'
    });

    let loader = $('.loader');
    let submit = $('#submit');
    submit.click(function () {
        let tel = $('#tel');
        let hasError = false;
        tel.css('border-color', 'grey');
        $('.error-input').hide();

        if (!tel.val()) {
            tel.next().show();
            hasError = true;
            tel.css('border-color', 'red');
        }

        if (!hasError) {
            loader.css('display', 'flex');
            $.ajax({
                method: 'POST',
                url: 'https://testologia.ru/checkout',
                data: {name: tel.val()}
            })
                .done(function (msg) {
                    loader.hide();
                    if (msg.success) {
                        tel.hide();
                        submit.hide();
                        $('.thanks').show();
                    } else {
                        alert('Введен неверный номер');
                    }
                });
        }


    })

    // Устанавливаем русскую локализацию
    Parsley.setLocale('ru');

    // Инициализация Parsley
    const form = $('#demo-form').parsley();

    // Функция проверки чекбоксов
    function validateCheckboxes() {
        const checkedCount = $('input[name="flowers[]"]:checked').length;
        const isValid = checkedCount > 0;

        if (!isValid) {
            $('#hobbies-error').show();
        } else {
            $('#hobbies-error').hide();
        }

        return isValid;
    }

    // Проверка чекбоксов при изменении
    $('input[name="flowers[]"]').on('change', function() {
        validateCheckboxes();
    });

    // Обработчик кнопки отправки
    $('#submit-btn').click(function() {
        // Сбрасываем предыдущие сообщения
        $('#success-message, #error-message').hide();

        // Проверяем все поля формы
        form.validate();

        // Проверяем чекбоксы отдельно
        const isFormValid = form.isValid();
        const areCheckboxesValid = validateCheckboxes();

        // Если все проверки пройдены
        if (isFormValid && areCheckboxesValid) {
            // Отключаем кнопку во время отправки
            $(this).prop('disabled', true);

            // Показываем индикатор загрузки
            loader.css('display', 'flex');

            // Отправляем AJAX запрос
            $.ajax({
                type: 'POST',
                url: 'https://testologia.ru/checkout ',
                data: {
                    name: $('input[name="fullname"]').val(),
                    email: $('input[name="email"]').val(),
                    flowers: $('input[name="flowers[]"]:checked').map(function() {
                        return this.value;
                    }).get(),
                    heard: $('select[name="heard"]').val(),
                    message: $('textarea[name="message"]').val()
                },
                success: function(response) {
                    console.log("Успешный ответ сервера:", response);
                    loader.hide();
                    $('#demo-form').hide();
                    $('#thankYou').show();
                },
                error: function(xhr, status, error) {
                    console.error("Ошибка запроса:", status, error);
                    loader.hide();
                    $('#error-message')
                        .html(`<strong>Ошибка ${xhr.status}!</strong> ${error || xhr.statusText}`)
                        .show();
                },
                complete: function() {
                    submitBtn.prop('disabled', false);
                }
            });
        }
    });



})

// if (!hasError) {
//     loader.css('display', 'flex');
//     $.ajax({
//         method: 'POST',
//         url: 'https://testologia.ru/checkout',
//         data: {name: tel.val()}
//     })
//         .done(function (msg) {
//             loader.hide();
//             if (msg.success) {
//                 tel.hide();
//                 submit.hide();
//                 $('.thanks').show();
//             } else {
//                 alert('Введен неверный номер');
//             }
//         });
// }