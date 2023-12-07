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

function hide_active_form() {
  $('.form_wrap .form_dialog.__shown').removeClass('__shown');
}

function form_type_next() {
  hide_active_form();
  if ($('.form_wrap .form_dialog.__type .form_options input:checked').val() === 'courier') {
    $('.form_wrap').data('pickup-type', 'courier')
    $('.form_steps .form_step.__type .contents').text('вызвать курьера');
    $('.form_wrap .form_dialog.__choose_date').addClass('__shown');
  } else {
    $('.form_wrap').data('pickup-type', 'terminal')
    $('.form_steps .form_step.__type .contents').text('сдать в терминале');
    $('.form_wrap .form_dialog.__choose_terminal').addClass('__shown');
  }
  $('.form_steps .form_step.__type').addClass("__shown");
}

function form_terminal_next() {
  hide_active_form();
  $('.form_steps .form_step.__terminal_address .contents').text(
    $('.form_wrap .form_dialog.__choose_terminal .form_options_flex input:checked').val()
  );
  $('.form_wrap .form_dialog.__choose_date').addClass('__shown');
  $('.form_steps .form_step.__terminal_address').addClass("__shown");
}

function form_date_next() {
  hide_active_form();
  function set_date_in_btn(button_subclass) {
    $(`.form_steps .form_step.${button_subclass} .contents .date`).text(
      $('.form_wrap .date_wrap .date_btn.__active').data('fulldate')
    )

    $(`.form_steps .form_step.${button_subclass} .contents .time-from`).text(
      $('.form_dialog .time_block .time_slots .time_slot_btn.__active').data('time-from')
    )

    $(`.form_steps .form_step.${button_subclass} .contents .time-to`).text(
      $('.form_dialog .time_block .time_slots .time_slot_btn.__active').data('time-to')
    )
    $(`.form_steps .form_step.${button_subclass}`).addClass("__shown");
  }

  if ($('.form_wrap').data('pickup-type') === 'courier') {
    set_date_in_btn('__when');
    $('.form_wrap .form_dialog.__address').addClass('__shown');
  } else {
    set_date_in_btn('__terminal_hours');
    $('.form_wrap .form_dialog.__properties').addClass('__shown');
  }
}

function form_address_next() {
  console.log($('.form_dialog .form_fields .form_input.__address').val())
  console.log($('.form_dialog .form_fields .form_input.__flat_num').val())

  $('.form_steps .form_step.__address .contents .address').text(
    $('.form_dialog .form_fields .form_input.__address').val()
  );

  let flat_num = $('.form_dialog .form_fields .form_input.__flat_num').val();
  if (flat_num.length > 0) {
    $('.form_steps .form_step.__address .contents .flat_num').text(
      ", квартира " + $('.form_dialog .form_fields .form_input.__flat_num').val()
    );
  } else {
    $('.form_steps .form_step.__address .contents .flat_num').text("")
  }

  hide_active_form();
  $('.form_steps .form_step.__address').addClass('__shown');
  $('.form_wrap .form_dialog.__properties').addClass('__shown');
}

function form_properties_next() {
  let properties = [];
  $('.form_wrap .form_dialog.__properties input:checked').each(function() {
    if ($(this).val() !== "") {
      properties.push($(this).val());
    }
  })

  if (properties.length > 0) {
    $('.form_steps .form_step.__properties .contents').text(
      properties.join(', ')
    )
  } else {
    $('.form_steps .form_step.__properties .contents').text(
      "нет"
    )
  }
  hide_active_form();
  $('.form_steps .form_step.__properties').addClass('__shown');
  $('.form_wrap .form_dialog.__box_add').addClass('__shown');
}

function form_final() {
  $('.form_steps .form_step.__box_count').addClass('__shown');
  hide_active_form();
  if ($('.form_wrap').data('pickup-type') === 'terminal') {
    $('.form_wrap .terminal_info').addClass('__shown');
  }
  $('.form_wrap .form_next').addClass('__hidden');
  $('.form_wrap .form_submit').addClass('__shown');
  $('.form_wrap .legal_text').addClass('__shown');
}

$('.form_wrap .form_next').click(function() {
  console.log($('.form_wrap .form_dialog.__shown').data('step'));
  switch ($('.form_wrap .form_dialog.__shown').data('step')) {
    case "type":
      form_type_next();
      break;
    case "choose_terminal":
      form_terminal_next();
      break;
    case "choose_date":
      form_date_next();
      break;
    case "address":
      form_address_next();
      break;
    case 'properties':
      form_properties_next();
      break;
    case 'box_add':
      form_final();
      break;
    default:
      console.error("Unknown next step, fallback to beginning");
      hide_active_form();
      hide_steps(0);
      $('.form_wrap .form_next').removeClass('__hidden');
      $('.form_wrap .form_submit').removeClass('__shown');
      $('.form_wrap .legal_text').removeClass('__shown');
      $('.form_wrap .terminal_info').removeClass('__shown');
      $('.form_wrap .form_dialog.__type').addClass('__shown');
      break;
  }
})

function hide_steps(pos) {
  $('.form_wrap .form_steps .form_step').each(function() {
    if ($(this).data('pos') >= pos) {
      $(this).removeClass('__shown');
    }
  })
}

$('.form_wrap .form_steps .form_step').click(function() {
  hide_steps($(this).data('pos'));
  hide_active_form();
  $('.form_wrap .form_next').removeClass('__hidden');
  $('.form_wrap .form_submit').removeClass('__shown');
  $('.form_wrap .legal_text').removeClass('__shown');
  $('.form_wrap .terminal_info').removeClass('__shown');
  switch ($(this).data('step')) {
    case "type":
      $('.form_wrap .form_dialog.__type').addClass('__shown');
      break;
    case "terminal_address":
      $('.form_wrap .form_dialog.__choose_terminal').addClass('__shown');
      break
    case "terminal_hours":
      $('.form_wrap .form_dialog.__choose_date').addClass('__shown');
      break;
    case "when":
      $('.form_wrap .form_dialog.__choose_date').addClass('__shown');
      break;
    case "address":
      $('.form_wrap .form_dialog.__address').addClass('__shown');
      break;
    case "properties":
      $('.form_wrap .form_dialog.__properties').addClass('__shown');
      break;
    case "box_count":
      $('.form_wrap .form_dialog.__box_add').addClass('__shown');
      break;
    default:
      console.error("Unknown step, fallback to beginning");
      $('.form_wrap .form_dialog.__type').addClass('__shown');
      break;
  }
})