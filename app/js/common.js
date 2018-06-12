$(document).ready(function () {
    //Направления деятельности слайдер
    $('.directions-wrapper').slick({
        arrows: false,
        dots: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
        //Мобильное меню
        $(".top-nav_btn").click(function () {
            event.preventDefault();
            $(".top-nav_menu").slideToggle(400);
        });
        $('.left-sidebar_btn').click(function (event) {
            event.preventDefault();
            $('.left-sidebar_menu').slideToggle(400);
        });
});


if(window.location.toString().indexOf('investments.html')>0) {
    $(document).ready(function () {
    //Ползунок
    var elem = document.querySelector('.calc-range');
    var init = new Powerange(elem, {
        min: 100000,
        max: 3000000,
        start: 1200000,
        hideRange: true,
        step: 100000
    });
    var per,
        month,
        result,
        monthly,
        total;
    var money = +$('.calc-range').val();

    $('input[name="programs"]').on('change', function (event) {
        month = +$(this).attr('data-month');
        per = +$(this).attr('data-per');
        result = Math.round(per / 12 * month * money);
        total = result + money;
        monthly = Math.round(result / month);
        $('#total').text(total.toLocaleString());
        $('.calc-monthly span').text(monthly.toLocaleString());
        $('#month').text(month);
    });

    $('.calc-range').on('change', function (event) {
        $('.calc-sum_invest_num span').text((Math.round($(this).val() / 10) * 10).toLocaleString());
        var radio = $('input[name="programs"]:checked');
        money = +$(this).val();
        month = +radio.attr('data-month');
        per = +radio.attr('data-per');
        result = Math.round(per / 12 * month * money);
        total = result + money;
        monthly = Math.round(result / month);
        $('#total').text(total.toLocaleString());
        $('.calc-monthly span').text(monthly.toLocaleString());
    });

});
}
