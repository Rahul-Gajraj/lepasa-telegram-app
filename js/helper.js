class Helper {
  activateTab(tabToActivate) {
    var tabWrapper = $(tabToActivate).parents(".tab-wrapper");
    var listContainers = tabWrapper.find(".tab-container");
    listContainers.each(function () {
      $(this).addClass("hide");
    });
    tabWrapper
      .find("." + $(tabToActivate).attr("data-tab"))
      .removeClass("hide");
  }
  openDrawer() {
    document.getElementById("drawer").style.bottom = "0";
    document.getElementById("backdrop").style.opacity = "1";
    document.getElementById("backdrop").style.visibility = "visible";
  }
  // Function to close the drawer
  closeDrawer() {
    document.getElementById("drawer").style.bottom = "-100%";
    document.getElementById("backdrop").style.opacity = "0";
    document.getElementById("backdrop").style.visibility = "hidden";
  }
  copyToClipboardRefUrl(textboxElement) {
    // Get the text field
    var copyText = document.getElementById(textboxElement);

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    // toast.show("Copied the text: " + copyText.value);
    toast.show("link copied");
  }
  getDateTimeDifference() {
    var timeOffset = new Date().getTimezoneOffset();

    var res =
      (Math.round(timeOffset / 60) < 0
        ? -Math.round(timeOffset / 60)
        : Math.round(timeOffset / 60)) +
      ":" +
      (timeOffset % 60 < 0 ? -(timeOffset % 60) : timeOffset % 60);

    var hr = res.split(":")[0];
    var min = res.split(":")[1];
    hr = Number(hr) < 10 ? `0${hr}` : hr;
    min = Number(min) < 10 ? `0${min}` : min;
    res = timeOffset < 0 ? `+${hr}:${min}` : `-${hr}:${min}`;

    return res;
  }
  getDateTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  getTimeStampMiliseconds() {
    return Date.parse(new Date());
  }
}
