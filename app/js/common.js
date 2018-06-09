$( document ).ready(function(){
    //Направления деятельности слайдер
    $('.directions-wrapper').slick({
        arrows: false,
        dots: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
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
    $( ".top-nav_btn" ).click(function(){ 
        event.preventDefault();
   $( ".top-nav_menu" ).slideToggle(400); 
 });
    $('.left-sidebar_btn').click(function(event) {
        event.preventDefault();
        $('.left-sidebar_menu').slideToggle(400);
    })
});