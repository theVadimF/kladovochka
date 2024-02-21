$('header .open_mobile_menu').click(function() {
  $('.mobile_menu_wrap').show();
  $('.mobile_menu_wrap').addClass('__animate_in');
})

$('.mobile_menu_wrap .mask').click(function() {
  $('.mobile_menu_wrap').removeClass('__animate_in');
})

$('.long_nav .nav_btn').click(function() {
  $('.long_nav .nav_btn').removeClass('__active');
  $(this).addClass('__active')
})