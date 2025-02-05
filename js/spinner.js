class Spinner {
  #customNavigator = null;
  #canvas = null;
  #ctx = null;
  #image = null;

  #step = 0.1 * Math.PI / 360;
  #angle = 30;
  #speed = 0;
  #cords = { xDown: 0, yDown: 0, xUp: 0, yUp: 0 };

  constructor(customNavigator) {
    this.#customNavigator = customNavigator;
    var canvas = document.getElementById('spinnerCanvas');
    var ctx = canvas.getContext('2d');

    this.#canvas = canvas;
    this.#ctx = ctx;

    var image = document.createElement("img");
    image.height = 310;
    image.width = 310;
    image.src = "/public/fidget.png";
    var that = this;
    image.addEventListener('load', function () {
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var width = image.width;
      var height = image.height;
      that.#ctx.drawImage(image, 0, 0, width, height);
    });
    this.#image = image;
    document.getElementById("svalue").innerHTML = this.#speed;
  }
  init() {
    var that = this;
    $("#spinnerCanvas")
      .on('touchstart', function (e) {
        var originalEvent = e.originalEvent;
        if (originalEvent == undefined)
          originalEvent = e;
        that.#cords.xDown = originalEvent.touches[0].pageX;
        that.#cords.yDown = originalEvent.touches[0].pageY;
      })
      .on('touchend', function (e) {
        var originalEvent = e.originalEvent;
        if (originalEvent == undefined)
          originalEvent = e;
        that.#cords.xUp = originalEvent.changedTouches[0].pageX;
        that.#cords.yUp = originalEvent.changedTouches[0].pageY;
        if (that.#cords.xDown != that.#cords.xUp || that.#cords.yDown != that.#cords.yUp && that.#customNavigator.isSwipeEnabled() === true) {
          console.info('Swiped');
          that.#increaseSpeed(true);
        }
        else if (that.#customNavigator.isSwipeEnabled() === false) {
          console.info('Touched');
          that.#increaseSpeed(false);
        }
      });
    this.#render();
  }
  #increaseSpeed(isSwipe) {
    if (this.#speed < 1500)
      this.#speed += (isSwipe === true ? 200 : 100);
    this.#customNavigator.increaseEnergyValue();
  }

  #render = () => {
    var that = this;
    if (this.#speed > 0) {
      this.#ctx.clearRect(0, 0, 400, 400);

      this.#angle += this.#step * this.#speed;
      this.#speed = Math.max(this.#speed - 3, Math.min(this.#speed + 3, 0));

      var x = this.#canvas.width / 2;
      var y = this.#canvas.height / 2;
      var width = this.#image.width;
      var height = this.#image.height;

      console.log('Speed ' + this.#speed);
      this.#ctx.translate(x, y);
      this.#ctx.rotate(this.#angle);
      this.#ctx.drawImage(this.#image, -width / 2, -height / 2, width, height);
      this.#ctx.rotate(-this.#angle);
      this.#ctx.translate(-x, -y);
    }

    window.requestAnimationFrame(that.#render);
  }
}