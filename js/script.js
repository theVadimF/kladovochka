$('header .open_mobile_menu').click(function() {
  $('.mobile_menu_wrap').show();
  $('.mobile_menu_wrap').addClass('__animate_in');
})

$('.mobile_menu_wrap .mask').click(function() {
  $('.mobile_menu_wrap').removeClass('__animate_in');
})

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
    console.log($(this).siblings('.box_img_input'));
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
      console.log(step);
      // console.log($(that).siblings('.box_img_btn').children('.preview.__img')[0]);
      $($(that).siblings(`.box_img_btn[data-step=${step}]`).children('.preview.__img')[0]).attr('src', event.target.result);
      $('.popup.__img_preview .preview').attr('src', event.target.result);
      $(that).siblings(`.box_img_btn[data-step=${step}]`).addClass('__added').trigger('boxBtnUpdate');
      $(that).siblings(`.box_img_btn[data-step=${step}]`).children('.box_status').text(
        // 'Фото добавлено'
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
    }
  })
  if (flag) {
    $('.admin_orders .order_box .bottom_btns .accept_btn').attr('disabled', false);
  }
  console.log(flag);
})

$('.admin_orders .boxes_initial .box_wrap.__storage .box_topper').click(function() {
  $(this).parent('.box_wrap').toggleClass('__closed');
})

$('.admin_orders .boxes_initial .box_wrap.__storage .box_status_final').click(function() {
  $(this).parent('.box_wrap').removeClass('__closed');
})

$('.admin_orders .boxes_initial .box_wrap.__storage .toggle_box').click(function() {
  $(this).parent('.box_wrap').toggleClass('__closed');
})
