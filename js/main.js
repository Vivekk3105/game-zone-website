/**
 * GameZone - Main JavaScript
*/

$(document).ready(function() {
    

    // Sticky Navbar Effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar-custom').css('background', 'rgba(18, 18, 18, 0.95)');
            $('.navbar-custom').css('box-shadow', '0 4px 10px rgba(0,0,0,0.3)');
        } else {
            $('.navbar-custom').css('background', 'rgba(18, 18, 18, 0.9)');
            $('.navbar-custom').css('box-shadow', 'none');
        }
    });

    // Scroll to Top Button
    const scrollTopBtn = $("#scrollTopBtn");

    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            scrollTopBtn.fadeIn();
        } else {
            scrollTopBtn.fadeOut();
        }
    });

    scrollTopBtn.click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop:0}, '300');
    });

    // Smooth Scrolling for Anchor Links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if( target.length ) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });
});
