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

$('.admin_orders .boxes_initial .box_img_btn').click(function() {
  if ($(this).hasClass('__added')) {
    $('.popup.__img_preview .preview').attr('src',
      $($(this).children('.preview')).attr('src')
    );
    $('.popup.__img_preview .replace').removeClass('__shown');
    if (!$(this).parents('.boxes_initial').hasClass('__locked')) {
      $('.popup.__img_preview .replace.__img').addClass('__shown');
      $('.popup.__img_preview .replace.__img').data('target-id',
        $($(this).parents('.box_wrap')[0]).attr('id')
      );
    }
    $('.popup.__img_preview').addClass('__shown');
  } else {
    console.log($(this).siblings('.box_img_input'));
    $(this).siblings('.box_img_input').click();
  }
})

$('.admin_orders .boxes_initial .box_img_input').on('change', function(e) {
  let file = this.files[0];
  let that = this;
  if (file) {
    let reader = new FileReader();
    reader.onload = function(event){
      console.log($(that).siblings('.box_img_btn').children('.preview.__img')[0]);
      $($(that).siblings('.box_img_btn').children('.preview.__img')[0]).attr('src', event.target.result);
      $('.popup.__img_preview .preview').attr('src', event.target.result);
      $(that).siblings('.box_img_btn').addClass('__added').trigger('boxBtnUpdate');
      $(that).siblings('.box_img_btn').children('.box_status').text('Фото добавлено');
    }
    reader.readAsDataURL(file);
  }
})

$('.popup.__img_preview .float_buttons .close').click(function() {
  $('.popup.__img_preview').removeClass('__shown');
})

$('.popup .float_buttons .replace.__img').click(function() {
  $('#' + $(this).data('target-id')).children('.box_img_input').click();
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
