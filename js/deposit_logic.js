const date_slider = new Swiper('.date_slider', {
  slidesPerView: 2,
  slidesPerGroup: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: '.date_wrap .nav.next',
    prevEl: '.date_wrap .nav.prev',
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
    $('.date_wrap .nav.prev').fadeIn('fast');
  } else {
    $('.date_wrap .nav.prev').fadeOut('fast');
  }
})

$('.date_wrap .date_btn').click(function() {
  $('.date_wrap .date_btn').removeClass('__active');
  $(this).addClass('__active');
})

$('.time_block .time_slots .time_slot_btn').click(function() {
  $('.time_block .time_slots .time_slot_btn').removeClass('__active');
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
  $('.form_wrap .terminal_info .terminal_address').text(
    $('.form_wrap .form_dialog.__choose_terminal .form_options_flex input:checked').val()
  );
  $('.form_wrap .form_dialog.__choose_date').addClass('__shown');
  $('.form_steps .form_step.__terminal_address').addClass("__shown");
}

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


function form_date_next() {
  hide_active_form();
  if ($('.form_wrap').data('pickup-type') === 'courier') {
    set_date_in_btn('__when');
    $('.form_wrap .form_dialog.__address').addClass('__shown');
  } else {
    set_date_in_btn('__terminal_hours');
    $('.form_wrap .terminal_info .time-from').text(
      $('.form_dialog .time_block .time_slots .time_slot_btn.__active').data('time-from')
    );
    $('.form_wrap .terminal_info .time-to').text(
      $('.form_dialog .time_block .time_slots .time_slot_btn.__active').data('time-to')
    );
    $('.form_wrap .form_dialog.__properties').addClass('__shown');
  }
}

function form_address_next() {

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
  if ($('.form_dialog.__box_add .box_add').hasClass('__initial')) {
    $('.form_wrap .form_next').addClass("__hidden");
  }
}

function get_thing(amount) {
  if (amount % 10 == 1) {
    return " штука";
  }
  if (amount >= 10 && amount <= 20) {
    return " штук";
  }
  if (amount % 10 < 5) {
    return " штуки";
  }
  return " штука";
}

function get_box_count() {
  let amount = $('.form_dialog.__box_add .box_edit').length;
  if ($('.form_dialog.__box_add .form_fields').data('mode') === 'create') {
    ++amount;
  }
  return amount + get_thing(amount);
}

function form_final() {
  $('.form_steps .form_step.__box_count').addClass('__shown');
  $('.form_steps .form_step.__box_count .contents').text(get_box_count());
  $('.form_wrap .form_topper.__initial').addClass('__hidden')
  $('.form_wrap .form_topper.__final').removeClass('__hidden')
  hide_active_form();
  if ($('.form_wrap').data('pickup-type') === 'terminal') {
    $('.form_wrap .terminal_info').addClass('__shown');
  }
  $('.form_wrap .form_next').addClass('__hidden');
  $('.form_wrap .form_submit').addClass('__shown');
  $('.form_wrap .legal_text').addClass('__shown');
}

$('.form_wrap .form_next.__deposit').click(function() {
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
      $('.form_wrap .form_topper.__initial').removeClass('__hidden')
      $('.form_wrap .form_topper.__final').addClass('__hidden')
      break;
  }
})

function return_form_type_next() {
  if ($('.form_wrap .form_dialog.__type .form_options input:checked').val() === 'courier') {
    // SWITCH PAGE HERE
  } else {
    hide_active_form();
    $('.form_wrap').data('pickup-type', 'terminal')
    $('.form_steps .form_step.__type .contents').text('сдать в терминале');
    $('.form_wrap .form_dialog.__choose_terminal').addClass('__shown');
    $('.form_steps .form_step.__type').addClass("__shown");
  }
}

function return_form_final() {
  hide_active_form();
  set_date_in_btn('__terminal_hours');
  $('.form_wrap .terminal_info').addClass('__shown');
  $('.form_wrap .form_next').addClass('__hidden');
  $('.form_wrap .form_submit').addClass('__shown');
  $('.form_wrap .legal_text').addClass('__shown');
  $('.form_wrap .request_info').addClass("__shown");
}

$('.form_wrap .form_next.__return').click(function() {
  switch ($('.form_wrap .form_dialog.__shown').data('step')) {
    case "type":
      return_form_type_next();
      break;
    case "choose_terminal":
      form_terminal_next();
      break;
    case "choose_date":
      return_form_final();
      break;
    default:
      console.error("Unknown next step");
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
  $('.form_wrap .request_info').removeClass('__shown');
  $('.form_wrap .form_topper.__initial').removeClass('__hidden');
  $('.form_wrap .form_topper.__final').addClass('__hidden');
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

function create_box_entry() {
  let weight = $('.form_dialog.__box_add .form_input.__weight').val();
  let length = $('.form_dialog.__box_add .form_input.__length').val();
  let width = $('.form_dialog.__box_add .form_input.__width').val();
  let height = $('.form_dialog.__box_add .form_input.__height').val();
  let comment = $('.form_dialog.__box_add .form_input.__comment').val();
  let id = $('.form_dialog.__box_add').data('id-origin');
  $('.form_dialog.__box_add').data('id-origin', id + 1);
  $('.form_dialog.__box_add .box_list').append(`
    <button class="transparent_btn box_edit text" id="box_${id}">
      <p class="info">
        Коробка <span class="box_number">0</span>: 
        <span class="weight">${weight}</span> кг, 
        <span class="length">${length}</span>х<span class="width">${width}</span>х<span class="height">${height}</span>. 
        <span class="comment">${comment}</span>
      </p>
      <img src="./img/ico/edit_pencil.png" alt="" class="icon">
    </button>
  `)
  $('.form_dialog.__box_add .form_input').val("");
}

function update_box(id) {
  let weight = $('.form_dialog.__box_add .form_input.__weight').val();
  let length = $('.form_dialog.__box_add .form_input.__length').val();
  let width = $('.form_dialog.__box_add .form_input.__width').val();
  let height = $('.form_dialog.__box_add .form_input.__height').val();
  let comment = $('.form_dialog.__box_add .form_input.__comment').val();
  $(`#${id} .weight`).text(weight);
  $(`#${id} .length`).text(length);
  $(`#${id} .width`).text(width);
  $(`#${id} .height`).text(height);
  $(`#${id} .comment`).text(comment);
  $(`#${id}`).removeClass('__hidden');
  $('.form_dialog.__box_add .form_input').val("");
}

function set_box_numbers() {
  $('.form_dialog.__box_add').find('.box_number').each(function(index) {
    $(this).text(index + 1);
  })
}

$('.form_dialog.__box_add .box_add').click(function() {
  let $form_fiedls = $(".form_dialog.__box_add .form_fields");
  if ($form_fiedls.data("mode") === "create") {
    if ($(this).hasClass('__initial')) {
      $(this).removeClass('__initial');
      $(this).text('Добавить еще коробку');
      $form_fiedls.removeClass('__hidden');
      $('.form_dialog.__box_add .topper_wrap').removeClass('__hidden');
      $('.form_dialog.__box_add .box_list').removeClass('__hidden')
      $('.form_dialog.__box_add .form_title').text('Введите габариты и добавьте еще коробки при необходимости');
      $('.form_wrap .form_next').removeClass('__hidden');
    } else {
      create_box_entry();
    }
    set_box_numbers();
  } else {
    let $form_fiedls = $(".form_dialog.__box_add .form_fields");
    update_box($form_fiedls.data('target-id'));
    $form_fiedls.data("mode", "create");
    set_box_numbers();
  }
})

function init_edit(element) {
  set_box_numbers();
  $(element).addClass("__hidden");
  $(".form_dialog.__box_add .form_fields").data("mode", "edit");
  $(".form_dialog.__box_add .form_fields").data("target-id", $(element).attr('id'));
  let weight = $(element).find('.weight').text();
  let length = $(element).find('.length').text();
  let width = $(element).find('.width').text();
  let height = $(element).find('.height').text();
  let comment = $(element).find('.comment').text();
  let number = $(element).find('.box_number').text();
  $(".form_dialog.__box_add .form_fields .form_input.__weight").val(weight);
  $(".form_dialog.__box_add .form_fields .form_input.__length").val(length);
  $(".form_dialog.__box_add .form_fields .form_input.__width").val(width);
  $(".form_dialog.__box_add .form_fields .form_input.__height").val(height);
  $(".form_dialog.__box_add .form_fields .form_input.__comment").val(comment);
  $(".form_dialog.__box_add .topper .box_number").text(number);
}

$(document).ready(function() {
  $(document).on("click", ".form_dialog.__box_add .box_edit" , function() {
    if ($(".form_dialog.__box_add .form_fields").data("mode") === 'edit') {
      let $form_fiedls = $(".form_dialog.__box_add .form_fields");
      update_box($form_fiedls.data('target-id'));
    } else {
      create_box_entry();
    }
    init_edit(this);
  })

  $(document).on("click", ".form_dialog.__box_add .delete_box" , function() {
    let $form_fiedls = $(".form_dialog.__box_add .form_fields");
    if ($form_fiedls.data('mode') === 'edit') {
      let id = $form_fiedls.data('target-id');
      $(`#${id}`).remove();
    }
    let $boxes = $('.form_dialog.__box_add .box_edit')
    if ($boxes.length >= 1) {
      init_edit($boxes[$boxes.length - 1]);
      $form_fiedls.data('mode', 'edit');
    } else {
      let $btn = $(".form_dialog.__box_add .box_add");
      $btn.addClass('__initial');
      $btn.text("Добавить коробку");
      $('.form_dialog.__box_add .topper_wrap').addClass('__hidden');
      $form_fiedls.addClass('__hidden');
      $('.form_dialog.__box_add .form_title').text('Добавьте необходимое количество коробок');
      $('.form_wrap .form_next').addClass('__hidden');
      $('.form_dialog.__box_add .box_list').addClass('__hidden')
    }
  })
})