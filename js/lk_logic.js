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

// TODO: move to code scanner
function check_scan_lock(obj) {
  let $wrapper = $(obj).parents('.boxes_initial');
  return parseInt($wrapper.data('lock')) < parseInt($(obj).data('step'));
}

$('.admin_orders .boxes_initial .box_img_btn').click(function() {
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

$('.admin_orders .boxes_initial .box_img_input').on('change', function(e) {
  let file = this.files[0];
  let that = this;
  if (file) {
    let reader = new FileReader();
    reader.onload = function(event){
      let step = $(that).data('step');
      $($(that).siblings(`.box_img_btn[data-step=${step}]`).children('.preview.__img')[0]).attr('src', event.target.result);
      $('.popup.__img_preview .preview').attr('src', event.target.result);
      $(that).siblings(`.box_img_btn[data-step=${step}]`).addClass('__added').trigger('boxBtnUpdate');
      $(that).siblings(`.box_img_btn[data-step=${step}]`).children('.box_status').text(
        $(that).siblings(`.box_img_btn[data-step=${step}]`).data('success-text')
      );
    }
    reader.readAsDataURL(file);
  }
})

$('.popup.__img_preview .float_buttons .close').click(function() {
  $('.popup.__img_preview').removeClass('__shown');
})

$('.popup .float_buttons .replace.__img').click(function() {
  let step = $(this).data('target-step')
  $('#' + $(this).data('target-id')).children(`.box_img_input[data-step=${step}]`).click();
})


$('.admin_orders .boxes_initial .box_btn').on('boxBtnUpdate', function() {
  let flag = true;
  $('.admin_orders .boxes_initial .box_btn').each(function() {
    if (!$(this).hasClass('__added')) {
      flag = false;
      return false;  // Break out of each loop
    }
  })
  if (flag) {
    $('.admin_orders .order_box .bottom_btns .accept_btn').attr('disabled', false);
  }
})

$('.admin_orders .boxes_initial .box_wrap.__storage .box_top').click(function() {
  $(this).parent('.box_wrap').toggleClass('__closed');
})

$('.admin_orders .boxes_initial .box_wrap.__storage .toggle_box').click(function() {
  $(this).parent('.box_wrap').toggleClass('__closed');
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
    let text = $('.popup.__code').data("success-text");
    $(`#${id} .box_scan_btn[data-step="${step}"]`).addClass('__added');
    $(`#${id} .box_img_btn[data-step="${step}"]`).attr('disabled', false);
    $(`#${id} .box_scan_btn[data-step="${step}"] .box_status`).text(text);
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


