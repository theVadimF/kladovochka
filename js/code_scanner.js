const genQR = (data, id) => {
  const qr = new QRCode("qrcode", {
    text: data.decodedText,
    width: 365,
    height: 365,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  })
  let base64 = qr._oDrawing._elCanvas.toDataURL("image/png");
  $('#' + id + " .preview.__qr").attr('src', base64);
  $('#' + id + " .box_status.__qr").text("Штрих-код добавлен");
  $('#' + id + " .box_scan_btn").addClass("__added");
  $('#' + id + " .box_img_btn").prop("disabled", false);
}

const handleResult = (data) => {
  let id = $('.popup.__scanner').data("target-id");
  $('#' + id).data('qr', data.decodedText);
  $('#' + id).trigger("changeData");
  $('.popup.__scanner').fadeOut('fast');
  genQR(data, id);
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
    console.log(err)
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
const Scanner = (cameras) => {
  let current_width = 250;
  let current_height = 250;
  let current_cam = findSuitableCamera(cameras);
  const html5QrCode = new Html5Qrcode("viewport");  // elementId

  cameraSelector(cameras, current_cam);
  startScanner(html5QrCode, current_cam, current_width, current_height);

  $('#cameras').on('change', function () {
    current_cam = this.value;
    reloadScanner(html5QrCode, this.value, current_width, current_height);
  })

  // $('.format_btn#square').click(function() {
  //   current_width = 250;
  //   current_height = 250;
  //   reloadScanner(html5QrCode, current_cam, current_width, current_height);
  // })

  // $('.format_btn#barcode').click(function() {
  //   current_width = 300;
  //   current_height = 150;
  //   reloadScanner(html5QrCode, current_cam, current_width, current_height);
  // })

  // $('.format_btn#full').click(function() {
  //   current_width = '100%';
  //   current_height = '100%';
  //   reloadScanner(html5QrCode, current_cam, current_width, current_height);
  // })

  $(window).on("orientationchange",function() {
    reloadScanner(html5QrCode, current_cam, current_width, current_height);
  })
}

const showError = (msg) => {
  $('.scanner .status_text').text(msg);
  $('.scanner .viewport').addClass('__error')
}

const Init = () => {
  // This method will trigger user permissions
  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      // Cameras found
      Scanner(devices);
    } else {
      // No cameras found
      showError("Камера не обнаружена");
    }
  }).catch(err => {
    // Permission denied
    console.log(err);
    showError('Нет доступа к камерам')
  });
}

$('.admin_orders .boxes_initial .box_scan_btn').click(function() {
  console.log($(this).parent().attr('id'));
  if ($(this).hasClass('__added')) {
    console.log('WIP')
  } else {
    $('.popup.__scanner').data("target-id", $(this).parent().attr('id'));
    $('.popup.__scanner').fadeIn('fast')
    Init();
  }
})