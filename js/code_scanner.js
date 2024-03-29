const updateBtn = (data, id) => {
  const qr = new QRCode("qrcode", {
    text: data.decodedText,
    width: 365,
    height: 365,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  })
  let base64 = qr._oDrawing._elCanvas.toDataURL("image/png");
  let target_step = $('.popup.__scanner').data('target-step');
  $(`#${id} .box_scan_btn[data-step="${target_step}"] .preview.__qr`).attr('src', base64);
  $(`#${id} .box_scan_btn[data-step="${target_step}"] .box_status.__qr`).addClass('__hidden');
  $(`#${id} .box_scan_btn[data-step="${target_step}"] .box_status.__qr.__success`).removeClass('__hidden');
  $(`#${id} .box_scan_btn[data-step=${target_step}]`).addClass("__added");
  $(`#${id}`).parents('.boxes_initial').trigger('boxBtnUpdate');
  $(`#${id} .box_img_btn[data-step=${target_step}]`).prop("disabled", false);
  $(`#${id} .box_topper`).addClass('__shown');
}

const handleResult = (data) => {
  let id = $('.popup.__scanner').data("target-id");
  // $('#' + id).data('qr', data.decodedText);
  console.log(data.decodedText);
  $('#' + id).trigger("changeData");
  $('.popup.__scanner').removeClass('__shown');
  updateBtn(data, id);
}

const startScanner = (html5QrCode, cameraId, boxWidth, boxHeight) => {
  html5QrCode.start(
    cameraId,
    {
      fps: 10,
      qrbox: { width: boxWidth, height: boxHeight }
    },
    (decodedText, decodedResult) => {
      handleResult(decodedResult);
      html5QrCode.stop();
    }).catch((err) => {
    console.error(err)
  });
}

const cameraSelector = (cameras, current_cam) => {
  let count = cameras.length;
  for (let i = 0; i < count; i++) {
    if (cameras[i].id === current_cam) {
      $('#cameras').append($("<option></option>")
      .attr("value", cameras[i].id)
      .attr("selected", "selected")
      .text(cameras[i].label));
    } else {
      $('#cameras').append($("<option></option>")
        .attr("value", cameras[i].id)
        .text(cameras[i].label));
    }
  }
}

const reloadScanner = (html5QrCode, cameraId, current_width, current_height) => {
  html5QrCode.stop().then(() => {
    startScanner(html5QrCode, cameraId, current_width, current_height);
  });
}

// Attempts to find the rear camera based on keywords
const findSuitableCamera = (cameras) => {
  let keywords = [
    'back',
    'задней',
    'rear'
  ]
  let count = cameras.length;
  let keyword_count = keywords.length;

  for (let i = 0; i < count; ++i) {
    for (let j = 0; j < keyword_count; ++j) {
      if (cameras[i].label.includes(keywords[j])) {
        return cameras[i].id;
      }
    }
  }

  return cameras[0].id;
}

let html5QrCode = null

const Scanner = (cameras, scan_type) => {
  let current_width = 250;
  let current_height = 250;
  if (scan_type === 'barcode') {
    current_width = 300;
    current_height = 150;
  }
  let current_cam = findSuitableCamera(cameras);
  html5QrCode = new Html5Qrcode("viewport");  // elementId

  cameraSelector(cameras, current_cam);
  startScanner(html5QrCode, current_cam, current_width, current_height);

  $('#cameras').on('change', function () {
    current_cam = this.value;
    reloadScanner(html5QrCode, this.value, current_width, current_height);
  })

  $(window).on("orientationchange",function() {
    reloadScanner(html5QrCode, current_cam, current_width, current_height);
  })
}

$('.popup .scanner .close').click(function() {
  html5QrCode.stop();
  // $('.popup.__scanner').fadeOut('fast');
  $('.popup.__scanner').removeClass('__shown');
})

const showError = (msg) => {
  $('.scanner .status_text').text(msg);
  $('.scanner .viewport').addClass('__error')
}

const Init = (scan_type) => {
  // This method will trigger user permissions
  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      // Cameras found
      Scanner(devices, scan_type);
    } else {
      // No cameras found
      showError("Камера не обнаружена");
    }
  }).catch(err => {
    // Permission denied
    console.error(err);
    showError('Нет доступа к камерам')
  });
}

function check_scan_lock(obj) {
  let $wrapper = $(obj).parents('.boxes_initial');
  return parseInt($wrapper.data('lock')) < parseInt($(obj).data('step'));
}

function clear_code_digits() {
  $('.popup.__code .digit').each(function() {
    $(this).val("");
  })
}

$(document).ready(function() {
  $(document).on("click", ".admin_orders .boxes_initial .box_scan_btn" , function() {
    let scan_type = $(this).data('scan-type');
    if ($(this).hasClass('__added')) {
      $('.popup.__img_preview .preview').attr('src',
        $($(this).children('.preview')).attr('src')
      );
      $('.popup.__img_preview .replace').removeClass('__shown');
      if (check_scan_lock(this)) {
        $('.popup.__img_preview .replace.__qr').addClass('__shown');
        $('.popup.__img_preview .replace.__qr').data('target-id',
          $($(this).parents('.box_wrap')[0]).attr('id')
        );
        $('.popup.__img_preview .replace.__qr').data('scan-type', scan_type);
      }
      $('.popup.__img_preview').data('target-step',
        $(this).data('step')
      );
      $('.popup.__img_preview').addClass('__shown');
    } else {
      if (scan_type === 'code') {
        clear_code_digits();
        $('.popup.__code').data("target-id", $(this).parents('.box_wrap').attr('id'));
        $('.popup.__code').data("target-step", $(this).data('step'));
        $('.popup.__code').addClass('__shown');
      } else {
        $('.popup.__scanner').data("target-id", $(this).parents('.box_wrap').attr('id'));
        $('.popup.__scanner').data("target-step", $(this).data('step'));
        $('.popup.__scanner').addClass('__shown');
        Init(scan_type);
      }
    }
  });
})

$('.popup .float_buttons .replace.__qr').click(function() {
  let scan_type = $(this).data('scan-type');
  $('.popup.__scanner').data("target-id", $(this).data('target-id'));
  $('.popup.__scanner').data("target-step", $(this).data('target-step'));
  $('.popup.__img_preview').removeClass('__shown');
  $('.popup.__scanner').addClass('__shown');
  Init(scan_type);
})