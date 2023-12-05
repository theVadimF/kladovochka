$('header .open_mobile_menu').click(function() {
  $('.mobile_menu_wrap').show();
  $('.mobile_menu_wrap').addClass('__animate_in');
})

$('.mobile_menu_wrap .mask').click(function() {
  $('.mobile_menu_wrap').removeClass('__animate_in');
  $(".mobile_menu_wrap .mask").on("transitionend", function(e){
    $(this).off(e);
    $('.mobile_menu_wrap').hide();
  });
})

const date_slider = new Swiper('.form_wrap .date_slider', {
  slidesPerView: 2,
  slidesPerGroup: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: '.form_wrap .date_wrap .nav.next',
    prevEl: '.form_wrap .date_wrap .nav.prev',
  },
  breakpoints: {
    890: {
      slidesPerView: 7,
      slidesPerGroup: 6,
    },
    800: {
      slidesPerView: 6,
      slidesPerGroup: 5,
    },
    700: {
      slidesPerView: 7,
      slidesPerGroup: 6,
    },
    650: {
      slidesPerView: 6,
      slidesPerGroup: 5,
    },
    550: {
      slidesPerView: 5,
      slidesPerGroup: 4,
    }, 
    465: {
      slidesPerView: 4,
      slidesPerGroup: 3,
    },
    370: {
      slidesPerView: 3,
      slidesPerGroup: 2,
    }
  }
})


date_slider.on('slideChange', function () {
  if (this.activeIndex > 0) {
    $('.form_wrap .date_wrap .nav.prev').fadeIn('fast');
  } else {
    $('.form_wrap .date_wrap .nav.prev').fadeOut('fast');
  }
})

$('.form_wrap .date_wrap .date_btn').click(function() {
  $('.form_wrap .date_wrap .date_btn').removeClass('__active');
  $(this).addClass('__active');
})

$('.form_dialog .time_block .time_slots .time_slot_btn').click(function() {
  $('.form_dialog .time_block .time_slots .time_slot_btn').removeClass('__active');
  $(this).addClass('__active');
})