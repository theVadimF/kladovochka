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

  // TODO(vf) Check lock on preliminary step
  $(document).on("click", ".admin_orders .order_box .bottom_btns .accept_btn", function() {
    let $order_box = $(this).parents('.order_box');
    let $wrapper = $order_box.find('.boxes_initial');
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
            box_storage($wrapper, 2);
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
      case 'terminal_courier':
        switch (state) {
          case 'initial':
            $order_box.data('state', 'deposit_storage');
            $(this).text('Отправить на склад');
            $(this).attr('disabled', true);
            $order_box.find('.box_inner_wrap .box_status_final').removeClass('__shown');
            $order_box.find('.box_top .box_status_final').addClass('__shown');
            box_storage($order_box.find(".boxes_initial"), 2);
            $order_box.find('.status_text').text('Передан курьеру');
            break;
          case 'deposit_storage':
            $order_box.data('state', 'to_storage');
            $(this).text('На хранении');
            $(this).attr('disabled', true);
            box_storage($order_box.find(".boxes_initial"), 3);
            break;
          case 'to_storage':
            $order_box.data('state', 'in_storage');
            $order_box.find('.status_text').text('Поставлен на хранение');
            $(this).parent().addClass('__hidden');
            break;
          default:
            console.error("Unknown state " + state);
            break;
        }
        break;
      case 'courier_return':
        switch (state) {
          case 'initial':
            $order_box.data('state', 'picked_up');
            $wrapper.data('lock', 1);
            $order_box.find('.status_text').text('Снят с хранения');
            $order_box.find('.box_top .box_status_final').addClass('__shown');
            $(this).text('Выдать');
            break;
          case 'picked_up':
            $order_box.data('state', 'return_to_client');
            $(this).text('Выдан клиенту');
            box_storage($wrapper, 2);
            break;
          case 'return_to_client':
            $order_box.data('state', 'completed');
            $order_box.find('.status_text').text('Передан клиенту');
            $(this).parent().addClass('__hidden');
            break;
          default:
            console.error("Unknown state " + state);
            break;
        }
        break;
      case 'terminal_return':
        switch (state) {
          case 'initial':
            $order_box.data('state', 'picked_up');
            $wrapper.data('lock', 1);
            $order_box.find('.status_text').text('Снят со склада');
            $order_box.find('.box_top .box_status_final').addClass('__shown');
            $(this).parent().addClass('__hidden');
            break;
          default:
            console.error("Unknown state " + state);
            break;
        }
        break;
      case 'manager':
        switch (state) {
          case 'initial':
            $order_box.data('state', 'in_terminal');
            $order_box.find('.status_text').text('Передан в терминал');
            $(this).text('Выдан клиенту');
            $(this).attr('disabled', true);
            $wrapper.data('lock', 2);
            box_storage($wrapper, 3);
            break;
          case 'in_terminal':
            $order_box.find('.status_text').text('Передан клиенту');
            $wrapper.data('lock', 3);
            $(this).parent().addClass('__hidden');
            break;
          default:
            break;
        }
        break;
      default:
        console.error('Unknown type ' + type);
        break;
    }
  })
})

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
    $(`#${id} .box_scan_btn[data-step="${step}"] .box_status.__qr`).addClass('__hidden');
    $(`#${id} .box_scan_btn[data-step="${step}"] .box_status.__qr.__success`).removeClass('__hidden');
    // Img placeholder for code entry
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

function is_box_dynamic(type) {
  switch (type) {
    case 'courier_return':
      return false;
    case 'terminal_return':
      return false;
    default:
      return true;
  }
}

function accept_btn_text(type) {
  switch (type) {
    case 'courier_return':
      return "Снят с хранения";
    case 'terminal_return':
      return "Снят со склада";
    default:
      return "Принять"
  }
}

$('.admin_orders .order_box .bottom .accept_initial').click(function() {
  $(this).addClass('__hidden');
  let $hidden_block = $(this).parents('.hidden_block');
  let $outer_wrapper = $hidden_block.parents('.order_box');
  let id = $(this).parents('.order_box').data('order-num');
  let type = $outer_wrapper.data('type')
  let dynamic = is_box_dynamic(type);
  // TODO(vf) rework this
  let hide_add_box = "";
  let hide_accept = "__hidden";
  if (!dynamic) {
    hide_add_box = "__hidden"
    hide_accept = ""
  }
  $hidden_block.append(`
    <div class="boxes_initial" data-lock="0" data-order-num="${id}" data-id-origin="0">
    </div>
    <div class="bottom_btns box_wrap">
      <button class="beige_btn bottom_btn __white add_box ${hide_add_box}">Добавить коробку / место</button>
      <button class="beige_btn bottom_btn accept_btn ${hide_accept}" disabled autocomplete="off">${accept_btn_text(type)}</button>
    </div>
  `);
  let $wrapper = $hidden_block.find('.boxes_initial');
  if (dynamic) {
    init_box_add();
  } else {
    let box_count = parseInt($outer_wrapper.data('box-count'));
    for (let i = 1; i <= box_count; ++i) {
      add_box($wrapper, false);
    }
  }
})

// TODO(vf) Show top status
function init_box_add() {
  $('.admin_orders .order_box .bottom_btns .add_box').click(function() {
    $(this).text("Добавить еще коробку");
    $(this).siblings('.accept_btn').removeClass('__hidden');
    let $wrapper = $(this).parents('.hidden_block').children('.boxes_initial')
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
          type: "barcode"
        },
        img: {
          initial: `Добавьте фото коробки <span class="box_number">0</span>`,
          success: `Фото добавлено`,
        }
      }
    case "terminal_receive":
      return {
        scan: {
          initial: `Добавьте штрих-код коробки <span class="box_number">0</span>`,
          success: `Штрих-код добавлен`,
          type: "barcode"
        },
        img: {
          initial: `Добавьте фото коробки <span class="box_number">0</span>`,
          success: `Фото добавлено`,
        }
      }
    case "courier_return":
      return {
        scan: {
          initial: `Добавьте штрих-код места <span class="box_number">0</span>`,
          success: `Штрих-код места <span class="box_number">0</span> добавлен`,
          type: "qrcode"
        },
        img: {
          initial: `Добавьте фото снятия со склада <span class="box_number">0</span>`,
          success: `Фото снятия со склада <span class="box_number">0</span> добавлено`,
        }
      }
    case "terminal_return":
      return {
        scan: {
          initial: `Добавьте штрих-код места <span class="box_number">0</span>`,
          success: `Штрих-код места <span class="box_number">0</span> добавлен`,
          type: "qrcode"
        },
        img: {
          initial: `Добавьте фото снятия со склада <span class="box_number">0</span>`,
          success: `Фото снятия со склада <span class="box_number">0</span> добавлено`,
        }
      }
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
          type: "qrcode"
        },
        img: {
          initial: `Добавьте фото хранения <span class="box_number">0</span>`,
          success: `Фото хранения добавлено`,
        }
      }
    case "terminal_courier":
      return {
        scan: {
          initial: `Добавьте скан коробки <span class="box_number">0</span>`,
          success: `Скан коробки <span class="box_number">0</span> добавлен`,
          type: "barcode"
        },
        img: {
          initial: `Фото принятия из терминала <span class="box_number">0</span>`,
          success: `Фото принятия <span class="box_number">0</span> добавлено`,
        }
      }
    case 'courier_return':
      return {
        scan: {
          initial: `Добавьте штрих-код коробки <span class="box_number">0</span>`,
          success: `Штрих-код коробки <span class="box_number">0</span> добавлен`,
          type: "code"
        },
        img: {
          initial: `Добавьте фото выдачи коробки <span class="box_number">0</span>`,
          success: `Фото выдачи коробки <span class="box_number">0</span> добавлено`,
        }
      }
    case 'manager':
      return {
        scan: {
          initial: `Добавьте скан коробки <span class="box_number">0</span>`,
          success: `Скан коробки <span class="box_number">0</span> добавлен`,
          type: "barcode"
        },
        img: {
          initial: `Добавьте фото передачи в терминал <span class="box_number">0</span>`,
          success: `Фото передачи в терминал добавлено`,
        }
      }
    default:
      console.error("Unknown type " + type);
      break;
  }
}

function configure_step3(type) {
  switch (type) {
    case "terminal_courier":
      return {
        scan: {
          initial: `Добавьте скан места <span class="box_number">0</span>`,
          success: `Скан места <span class="box_number">0</span> добавлен`,
          type: "qrcode"
        },
        img: {
          initial: `Добавьте фото хранения <span class="box_number">0</span>`,
          success: `Фото хранения <span class="box_number">0</span> добавлено`,
        }
      }
    case 'manager':
      return {
        scan: {
          initial: `Отсканируйте коробку <span class="box_number">0</span>`,
          success: `Коробка <span class="box_number">0</span> отсканирована`,
          type: "code"
        },
        img: {
          initial: `Добавьте фото выдачи клиенту`,
          success: `Фото выдачи клиенту добавлено`,
        }
      }
    default:
      console.error("Unknown type " + type);
      break;
  }
}

function add_box($wrapper, allow_delete) {
  let id = $wrapper.data('order-num');
  let box_id = parseInt($wrapper.data('id-origin')) + 1;
  let step_config = configure_step1($wrapper.parents('.order_box').data('type'));
  // TODO(vf) Rework this
  let hide_delete = "";
  let show_topper = "__shown";
  if (!allow_delete) {
    show_topper = "";
    hide_delete = "__hidden";
  }
  $wrapper.data('id-origin', box_id);
  $wrapper.append(`
    <div class="box_wrap" id="box${id}_${box_id}">
      <div class="box_top">
        <p class="text bold_info box_topper ${show_topper}">Коробка <span class="box_number">0</span></p>
        <button class="transparent_btn delete_box ${hide_delete}">Удалить</button>
        <p class="text box_status_final"><b class="bold_info">Статус: </b><span class="status_text">Принят у клиента</status></p>
      </div>
      <div class="box_inner_wrap">
        <button class="transparent_btn box_btn box_scan_btn text" data-step="1" data-scan-type="${step_config.scan.type}">
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

function box_storage($wrapper, step) {
  let step_config;
  switch (step) {
    case 2:
      step_config = configure_step2($wrapper.parents('.order_box').data('type'));
      break;
    case 3:
      step_config = configure_step3($wrapper.parents('.order_box').data('type'));
      break;
    default:
      console.log("Unknown step: " + step); 
      break;
  }
  $wrapper.data('lock', step - 1);  // TODO(vf) Move to config
  $wrapper.children('.box_wrap').each(function() {
    $(this).addClass('__storage');
    $(this).find('.box_inner_wrap').append(`
      <button class="transparent_btn box_btn box_scan_btn text" data-step="${step}" data-scan-type="${step_config.scan.type}">
        <span class="box_status __qr">${step_config.scan.initial}</span>
        <span class="box_status __qr __success __hidden">${step_config.scan.success}</span>
        <img src="./img/ico/img_placeholder.png" alt="" class="preview __qr">
      </button>
      <input type="file" class="box_img_input" accept="image/*" capture data-step="${step}">
      <button class="transparent_btn box_btn box_img_btn text" disabled autocomplete="off" data-step="${step}">
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
