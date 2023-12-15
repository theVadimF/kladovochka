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

$('.popup .scanner .close').click(function() {
  $('.popup.__scanner').fadeOut('fast');
})

$('.admin_orders .boxes_initial .box_img_btn').click(function() {
  if ($(this).hasClass('__added')) {
    console.log('WIP')
  } else {
    console.log($(this).siblings('.box_img_input'));
    $(this).siblings('.box_img_input').click();
  }
})

$('.admin_orders .boxes_initial .box_img_input').on('change', function(e) {
  console.log(this.files);
  let file = this.files[0];
  let that = this;
  if (file) {
    let reader = new FileReader();
    reader.onload = function(event){
      console.log(event.target.result);
      // $('.admin_orders .boxes_initial .box_btn .preview.__img').attr('src', event.target.result);
      console.log($(that).siblings('.box_img_btn').children('.preview.__img')[0]);
      $($(that).siblings('.box_img_btn').children('.preview.__img')[0]).attr('src', event.target.result);
      $(that).siblings('.box_img_btn').addClass('__added')
      $(that).siblings('.box_img_btn').children('.box_status').text('Фото добавлено');
    }
    reader.readAsDataURL(file);
  }
})