$('.dropdown_wrap .open_dropdown').click(function(e) {
  let $container = $(this).siblings('.contents_outer');
  if ($container.hasClass('__shown')) {
    $container.removeClass('__shown');
  } else {
    $('.dropdown_wrap .contents_outer').removeClass('__shown');
    $(this).siblings('.contents_outer').toggleClass('__shown');
  }
})

$('.dropdown_wrap .contents .option').click(function() {
  let $wrap = $(this).parents('.dropdown_wrap');
  $wrap.find('.option').removeClass('__selected');
  if ($wrap.hasClass('__update_text')) {
    $wrap.find('.current_option').text(
      $(this).data('value')
    );
  }
  $wrap.children('.contents_outer').removeClass('__shown');
  $(this).addClass('__selected');
})

$('.admin_orders .order_box .order_grid').click(function(e) {
  if (!$(this).parent().hasClass('__open')) {
    $(this).parent().addClass('__open');
  }
})

$('.admin_orders .order_box .toggle_order').click(function() {
  $(this).parents('.order_box').toggleClass('__open');
})

$('.admin_orders .order_box .status').click(function() {
  $(this).parents('.order_box').toggleClass('__open');
})

function check_scan_lock(obj) {
  let $wrapper = $(obj).parents('.boxes_initial');
  return parseInt($wrapper.data('lock')) < parseInt($(obj).data('step'));
}

$(document).ready(function() {
  $(document).on("click", ".admin_orders .boxes_initial .box_img_btn" , function() {
    if ($(this).hasClass('__added')) {
      $('.popup.__img_preview .preview').attr('src',
        $($(this).children('.preview')).attr('src')
      );
      $('.popup.__img_preview .replace').removeClass('__shown');
      if (check_scan_lock(this)) {
        $('.popup.__img_preview .replace.__img').addClass('__shown');
        $('.popup.__img_preview .replace.__img').data('target-id',
          $($(this).parents('.box_wrap')[0]).attr('id')
        );
        $('.popup.__img_preview .replace.__img').data('target-step',
          $(this).data('step')
        );
      }
      $('.popup.__img_preview').addClass('__shown');
    } else {
      $(this).siblings('.box_img_input[data-step=' + $(this).data('step') + ']').click();
    }
  })

  $(document).on("change", ".admin_orders .boxes_initial .box_img_input" , function() {
    let file = this.files[0];
    let that = this;
    if (file) {
      let reader = new FileReader();
      reader.onload = function(event){
        let step = $(that).data('step');
        $($(that).siblings(`.box_img_btn[data-step=${step}]`).children('.preview.__img')[0]).attr('src', event.target.result);
        $('.popup.__img_preview .preview').attr('src', event.target.result);
        $(that).siblings(`.box_img_btn[data-step=${step}]`).addClass('__added');
        $(that).parents('.boxes_initial').trigger('boxBtnUpdate');
        $(that).siblings(`.box_img_btn[data-step=${step}]`).children('.box_status.__img').addClass('__hidden');
        $(that).siblings(`.box_img_btn[data-step=${step}]`).children('.box_status.__img.__success').removeClass('__hidden');
      }
      reader.readAsDataURL(file);
    }
  })

  $(document).on("click", ".popup.__img_preview .float_buttons .close" , function() {
    $('.popup.__img_preview').removeClass('__shown');
  })

  $(document).on("click", ".popup .float_buttons .replace.__img" , function() {
    let step = $(this).data('target-step');
    console.log(step);
    console.log($(this).data('target-id'));
    $('#' + $(this).data('target-id')).find(`.box_img_input[data-step=${step}]`).click();
  })

  $(document).on("boxBtnUpdate", ".admin_orders .boxes_initial", function() {
    let flag = true;
    $btns = $(this).find('.box_btn')
    if ($btns.length > 0) {
      $btns.each(function() {
        if (!$(this).hasClass('__added')) {
          flag = false;
          return false;  // Break out of each loop
        }
      })
    } else {
      flag = false;
    }
    $(this).siblings('.bottom_btns').children('.accept_btn').attr('disabled', !flag);
  })

  $(document).on("click", ".admin_orders .boxes_initial .delete_box" , function() {
    let $box_wrap = $(this).parents('.box_wrap');
    let $wrapper = $(this).parents('.boxes_initial');
    $box_wrap.remove();
    set_box_numbers($wrapper);
  })

  $(document).on("click", ".admin_orders .boxes_initial .box_wrap.__storage .box_top" , function() {
    $(this).parents('.box_wrap').toggleClass('__closed');
  })

  $(document).on("click", ".admin_orders .boxes_initial .box_wrap.__storage .toggle_box" , function() {
    $(this).parents('.box_wrap').toggleClass('__closed');
  })

  $(document).on("click", ".admin_orders .order_box .bottom_btns .accept_btn", function() {
    let $order_box = $(this).parents('.order_box');
    let type = $order_box.data('type');
    let state = $order_box.data('state');
    switch (type) {
      case 'courier_receive':
        switch (state) {
          case 'initial':
            $order_box.data('state', 'accepted');
            $order_box.find('.delete_box').addClass('__hidden');
            $order_box.find('.box_inner_wrap .box_status_final').addClass('__shown');
            $order_box.find('.status_text').text('Принят у клиента');
            $(this).text('Поставить на хранение');
            $(this).siblings('.add_box').addClass('__hidden');
            break;
          case 'accepted':
            $order_box.data('state', 'deposit_storage');
            $(this).text('На хранении');
            $order_box.find('.box_inner_wrap .box_status_final').removeClass('__shown');
            $order_box.find('.box_top .box_status_final').addClass('__shown');
            $(this).attr('disabled', true);
            box_storage($order_box.find(".boxes_initial"));
            break;
          case 'deposit_storage':
            $order_box.data('state', 'in_storage');
            $order_box.find('.status_text').text('Поставлен на хранение');
            $(this).parent().addClass('__hidden');
            break;
          default:
            console.error("Unknown state " + state);
            break;
        }
        break;
      case "terminal_receive":
        switch (state) {
          case "initial":
            $order_box.data('state', 'in_terminal');
            $order_box.find('.delete_box').addClass('__hidden');
            $order_box.find('.box_inner_wrap .box_status_final').addClass('__shown');
            $order_box.find('.status_text').text('Принят у клиента');
            $(this).siblings('.add_box').addClass('__hidden');
            $(this).parent().addClass('__hidden');
            break;
          default:
            console.error("Unknown state " + state);
            break;
        }

        break;
      default:
        console.error('Unknown type ' + type);
        break;
    }
  })
})

// $('.admin_orders .boxes_initial .box_wrap.__storage .box_top').click(function() {
//   $(this).parent('.box_wrap').toggleClass('__closed');
// })

// $('.admin_orders .boxes_initial .box_wrap.__storage .toggle_box').click(function() {
//   $(this).parent('.box_wrap').toggleClass('__closed');
// })

let $inputs = $('.popup .code_wrap .digit_wrap .digit').on('input', function(e) {
  this.value = this.value.replace(/^0-9/g,'');
  let $input = $(e.target);
  let index = $inputs.index($input);
  if ($input.val().length >= $input.prop('maxlength')) {
    $inputs.eq(index + 1).focus();
  }
  if (this.value.length > 1) {
    this.value = this.value[0];
  }
});

function submit_code() {
  let flag = true;
  let code = "";
  $('.popup .code_wrap .digit_wrap .digit').each(function() {
    let val = $(this).val();
    if (val.length === 0) {
      flag = false;
      return false;
    }
    code += val;
  })
  if (flag) {
    console.log(code);
    let id = $('.popup.__code').data("target-id");
    let step = $('.popup.__code').data("target-step");
    $(`#${id} .box_scan_btn[data-step="${step}"]`).addClass('__added');
    $(`#${id} .box_img_btn[data-step="${step}"]`).attr('disabled', false);
    $(`#${id} .box_scan_btn[data-step="${target_step}"] .box_status.__qr`).addClass('__hidden');
    $(`#${id} .box_scan_btn[data-step="${target_step}"] .box_status.__qr.__success`).removeClass('__hidden');
    $(`#${id} .box_scan_btn[data-step="${step}"] .preview`).attr('src', "./img/qr_placeholder.png");
    $('.popup.__code').removeClass('__shown');
  }
}

$('.popup .code_wrap .digit_wrap .digit').on('keydown', function(e) {
  if (e.keyCode === 8) {
    let $input = $(e.target);
    let index = $inputs.index($input);
    if ($input.val().length >= $input.prop('maxlength')) {
      if (e.target.value === "") {
        $inputs.eq(index - 1).focus();
      }
    } else if (index > 0) {
      $inputs.eq(index - 1).focus();
    }
  } else if (e.keyCode === 13) {
    submit_code();
  }
})

$('.popup.__code .close').click(function() {
  $('.popup.__code').removeClass('__shown');
})

$('.admin_orders .order_box .bottom .accept_initial').click(function() {
  $(this).addClass('__hidden');
  let $hidden_block = $(this).parents('.hidden_block');
  let id = $(this).parents('.order_box').data('order-num');
  $hidden_block.append(`
    <div class="boxes_initial" data-lock="0" data-order-num="${id}" data-id-origin="0">
    </div>
    <div class="bottom_btns box_wrap">
      <button class="beige_btn bottom_btn __white add_box">Добавить коробку / место</button>
      <button class="beige_btn bottom_btn accept_btn __hidden" disabled autocomplete="off">Принять</button>
    </div>
  `);

  init_box_add();
})

function init_box_add() {
  $('.admin_orders .order_box .bottom_btns .add_box').click(function() {
    $(this).text("Добавить еще коробку");
    $(this).siblings('.accept_btn').removeClass('__hidden');
    let $wrapper = $(this).parents('.hidden_block').children('.boxes_initial')
    // TODO(vf) add condition for allow_delete
    add_box($wrapper, true);
  })
}

function configure_step1(type) {
  switch (type) {
    case "courier_receive":
      return {
        scan: {
          initial: `Добавьте штрих-код коробки <span class="box_number">0</span>`,
          success: `Штрих-код добавлен`,
        },
        img: {
          initial: `Добавьте фото коробки <span class="box_number">0</span>`,
          success: `Фото добавлено`,
        }
      }
      break;
    case "terminal_receive":
      return {
        scan: {
          initial: `Добавьте штрих-код коробки <span class="box_number">0</span>`,
          success: `Штрих-код добавлен`,
        },
        img: {
          initial: `Добавьте фото коробки <span class="box_number">0</span>`,
          success: `Фото добавлено`,
        }
      }
      break;
    default:
      console.error("Unknown type " + type);
      break;
  }
}

function configure_step2(type) {
  switch (type) {
    case "courier_receive":
      return {
        scan: {
          initial: `Отсканируйте место <span class="box_number">0</span>`,
          success: `Скан места добавлен`,
        },
        img: {
          initial: `Добавьте фото хранения <span class="box_number">0</span>`,
          success: `Фото хранения добавлено`,
        }
      }
      break;
    default:
      console.error("Unknown type " + type);
      break;
  }
}


function add_box($wrapper, allow_delete) {
  let id = $wrapper.data('order-num');
  let box_id = parseInt($wrapper.data('id-origin')) + 1;
  let step_config = configure_step1($wrapper.parents('.order_box').data('type'));
  let hide_delete = "";
  if (!allow_delete) {
    hide_delete = "__hidden";
  }
  $wrapper.data('id-origin', box_id);
  $wrapper.append(`
    <div class="box_wrap" id="box${id}_${box_id}">
      <div class="box_top">
        <p class="text bold_info box_topper __shown">Коробка <span class="box_number">0</span></p>
        <button class="transparent_btn delete_box ${hide_delete}">Удалить</button>
        <p class="text box_status_final"><b class="bold_info">Статус: </b><span class="status_text">Принят у клиента</status></p>
      </div>
      <div class="box_inner_wrap">
        <button class="transparent_btn box_btn box_scan_btn text" data-step="1" data-scan-type="barcode">
          <span class="box_status __qr">${step_config.scan.initial}</span>
          <span class="box_status __qr __success __hidden">${step_config.scan.success}</span>
          <img src="./img/ico/img_placeholder.png" alt="" class="preview __qr">
        </button>
        <input type="file" class="box_img_input" accept="image/*" capture data-step="1">
        <button class="transparent_btn box_btn box_img_btn text" disabled autocomplete="off" data-step="1">
          <span class="box_status __img">${step_config.img.initial}</span>
          <span class="box_status __img __success __hidden">${step_config.img.success}</span>
          <img src="./img/ico/img_placeholder.png" alt="" class="preview __img">
        </button>
        <p class="text box_status_final"><b class="bold_info">Статус: </b><span class="status_text">Принят у клиента</span></p>
      </div>
    </div>
  `)
  set_box_numbers($wrapper);
}

function box_storage($wrapper) {
  let step_config = configure_step2($wrapper.parents('.order_box').data('type'));
  $wrapper.data('lock', 1);
  $wrapper.children('.box_wrap').each(function() {
    $(this).addClass('__storage');
    $(this).find('.box_inner_wrap').append(`
      <button class="transparent_btn box_btn box_scan_btn text" data-step="2" data-scan-type="qrcode">
        <span class="box_status __qr">${step_config.scan.initial}</span>
        <span class="box_status __qr __success __hidden">${step_config.scan.success}</span>
        <img src="./img/ico/img_placeholder.png" alt="" class="preview __qr">
      </button>
      <input type="file" class="box_img_input" accept="image/*" capture data-step="2">
      <button class="transparent_btn box_btn box_img_btn text" disabled autocomplete="off" data-step="2">
        <span class="box_status __img">${step_config.img.initial}</span>
        <span class="box_status __img __success __hidden">${step_config.img.success}</span>
        <img src="./img/ico/img_placeholder.png" alt="" class="preview __img">
      </button>
      <button class="transparent_btn toggle_box">
        <svg class="expand_icon" xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M5 8L0.669872 0.5L9.33013 0.5L5 8Z" fill="#CEA075"></path>
        </svg>
      </button>
    `)
  })
  set_box_numbers($wrapper);
}

function set_box_numbers($wrapper) {
  $wrapper.trigger('boxBtnUpdate');
  $wrapper.children('.box_wrap').each(function(index) {
    $(this).find('.box_number').text(index + 1);
  })
}
