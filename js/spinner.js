'use strict';

var canvas = document.getElementById('spinnerCanvas');
var ctx = canvas.getContext('2d');

const image = document.createElement("img");
image.height = 300;
image.width = 300;
image.src = "/public/fidget.png";
image.addEventListener('load', function () {
  var x = canvas.width / 2;
  var y = canvas.height / 2;
  var width = image.width;
  var height = image.height;
  ctx.drawImage(image, 10, 10, width, height);
});


var step = 0.8 * Math.PI / 360;
var radius = 150;

var dragStart = false;
var angle = 30;
var speed = 0;
document.getElementById("svalue").innerHTML = speed;

function spin() {
  speed = document.getElementById("svalue").innerHTML;
}

function verifyorder() {
  speed = document.getElementById('value').value;
  document.getElementById("svalue").innerHTML = speed;
}



canvas.addEventListener('mousedown', function (_ref) {
  var clientX = _ref.clientX;
  var clientY = _ref.clientY;

  dragStart = { clientX: clientX, clientY: clientY };
});
canvas.addEventListener('touchstart', function (_ref2) {
  var originalEvent = _ref2.originalEvent;
  if (originalEvent == undefined)
    originalEvent = _ref2;
  dragStart = {
    clientX: originalEvent.touches[0].pageX,
    clientY: originalEvent.touches[0].pageY
  };
});
canvas.addEventListener('mousemove', function (_ref3) {
  var clientX = _ref3.clientX;
  var clientY = _ref3.clientY;
  return dragStart && function () {
    updateSpeed(dragStart, { clientX: clientX, clientY: clientY });
    dragStart = { clientX: clientX, clientY: clientY };
  }();
});
canvas.addEventListener('touchmove', function (_ref4) {
  var originalEvent = _ref4.originalEvent;
  if (originalEvent == undefined)
    originalEvent = _ref4;
  return dragStart && function () {
    updateSpeed(dragStart, {
      clientX: originalEvent.touches[0].pageX,
      clientY: originalEvent.touches[0].pageY
    });
    dragStart = {
      clientX: originalEvent.touches[0].pageX,
      clientY: originalEvent.touches[0].pageY
    };
    customNavigator.increaseEnergyValue();
  }();
});
canvas.addEventListener('touchend', function (_ref4) {
  customNavigator.increaseEnergyValue();
});
window.addEventListener('mouseup', function () {
  dragStart = false;
});
window.addEventListener('touchend', function () {
  dragStart = false;
});

function updateSpeed(startPos, endPos) {
  speed = (Math.atan2(startPos.clientX - (canvas.offsetLeft + canvas.width / 2), startPos.clientY - (canvas.offsetTop + canvas.height / 2)) - Math.atan2(endPos.clientX - (canvas.offsetLeft + canvas.width / 2), endPos.clientY - (canvas.offsetTop + canvas.height / 2))) * radius;
}

function render() {
  if (speed > 0) {
    ctx.clearRect(0, 0, 400, 400);

    angle += step * speed;
    speed = Math.max(speed - 0.2, Math.min(speed + 0.2, 0));

    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var width = image.width;
    var height = image.height;

    console.log('Speed ' + speed);
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.rotate(-angle);
    ctx.translate(-x, -y);
  }

  window.requestAnimationFrame(render);
}

render();