class Toast {
    show(message) {
        $("#toast_div").stop().fadeIn(400)
        $("#toast_div").html(`<p class="toast_msg" id="toast_msg">${message}</p>`);
        // $("#toast_div").stop().fadeIn(400).delay(3000).fadeOut(500);
        $("#toast_div").stop().fadeIn(400).delay(700).fadeOut(500);
    }
}
const toast = new Toast();


