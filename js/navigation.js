class Navigator {
    #controller = new Controller();
    constructor() {
    }
    init() {
        var that = this;
        this.#controller.getLandingPageInfo(function (controllerData) { that.landingPage(controllerData); });
    }
    hideAll() {
        $(".loading_screen").addClass('hide');
        $(".welcome_screen").addClass('hide');
        $(".welcome_bonus_wrapper").addClass('hide');
        $(".login_verification").addClass('hide');
        $(".play_container").addClass('hide');
        $(".earn_container").addClass('hide');
        $(".earn_detail_container").addClass('hide');
        $(".ref_container").addClass('hide');
        $(".shop_container").addClass('hide');
        $(".leagues_container").addClass('hide');
        $(".more_container").addClass('hide');
        $(".footer").addClass('hide');
    }
    landingPage(controllerData) {
        console.log('On landing page');
        var that = this;
        setTimeout(function () {
            if (controllerData && controllerData.isFreshUser === 1) {
                $("#txtWelcome_Bonus_Level_Text").text(controllerData.telegramLoyalty.name);
                $("#txtWelcome_Bonus_Level_Number").text(controllerData.telegramLoyalty.level);
                $("#txtWelcomeRewardNumber").text(controllerData.telegramLoyalty.amount);
                $("#btnFreshUserClaim").off('click').on('click', function () {
                    that.#controller.updateWelcomeClaim(function (controllerData) { that.gotoPlayPage(); });
                });
                that.gotoWelcomePage();
            }
            else
                that.gotoPlayPage();
        }, 300);
    }
    gotoWelcomePage() {
        $(".loading_screen").addClass('hide');
        $(".welcome_screen").removeClass('hide');
        var that = this;
        $(".welcome_claim_button").off('click').on('click', function () {
            that.gotoLoginVerificationPage();
        });
    }
    gotoLoginVerificationPage() {
        $(".welcome_screen").addClass('hide');
        $(".login_verification").removeClass('hide');
        var that = this;
        $(".login_verification_button").off('click').on('click', function () {
            that.gotoWelcomeBonusPage();
        });
    }
    gotoWelcomeBonusPage() {
        $(".login_verification").addClass('hide');
        $(".welcome_bonus_wrapper").removeClass('hide');
        $(".welcome_bonus").removeClass('hide');
        var that = this;
        $("#btnWelcomeBonusContinue").off('click').on('click', function () {
            that.gotoWelcomeRewardPage();
        });
    }
    gotoWelcomeRewardPage() {
        $(".welcome_bonus").addClass('hide');
        $(".welcome_reward").removeClass('hide');
        ////Continue button's binding is done above in landingPage() function because of data availability
    }
    gotoPlayPage() {
        this.hideAll();
        $(".play_container").removeClass('hide');
        $(".footer").removeClass('hide');
        this.#updatePlayePageUi();
        var vestingAmt = this.#controller.getUserInfoData().vestingAmount;
        if (vestingAmt > 0) {
            this.openAutomatedTellerDrawer(vestingAmt)
        }
    }
    openAutomatedTellerDrawer(vestingAmt) {
        this.openDrawer();
        $("#automated_teller_drawer").removeClass('hide');
        $("#txtVestingAmount").text(vestingAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        var that = this;
        $("#automated_teller_claim").off('click').on('click', function () {
            that.#controller.claimVestingAmount(function () {
                that.#updatePlayePageUi();
                $("#automated_teller_drawer").addClass('hide');
                that.closeDrawer();
                alert('Claimed Successfully');
            });
        });
    }
    #updatePlayePageUi() {
        var userInfoData = this.#controller.getUserInfoData();
        $("#txtMiningRate").text(userInfoData.miningRate + ' /s');
        $("#txtActiveBalance").text(userInfoData.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $("#txtBarCapacityRate").text(userInfoData.capacityRate);
    }
    gotoRefPage() {
        this.hideAll();
        $(".ref_container").removeClass('hide');
        $(".footer").removeClass('hide');
        var that = this;
        this.#controller.getReferralList(function (dataList) {
            var ulReferralListContainer = $("#ulReferralListContainer");
            ulReferralListContainer.empty();
            for (var i = 0; i < dataList.length; i++) {
                var dataRow = dataList[i];
                var progressPercent = dataRow.current * 100 / dataRow.max;
                if (progressPercent > 100)
                    progressPercent = 100;
                var html = `
                <li class="ref_item">
                    <div class="ref_item_container">
                        <div class="ref_item_content">
                            <p>${dataRow.txt}</p>
                            <div class="ref_coin">
                                <img src="/public/coin.png" height="20px" width="20px" />
                                <p>${dataRow.referralBonus}</p>
                            </div>
                        </div>
                        ${(dataRow.claimed === false && dataRow.current >= dataRow.max ? `<button type="button" class="claim" id="btnReferralClaim_${i}">Claim</button>` : '')
                    + (dataRow.claimed === true ? `<span>Claimed</span>` : '')
                    }                        
                    </div>
                    <div class="progress_bar_container">
                        <div class="progress_bar" style="width:${progressPercent}%;"></div>
                    </div>
                </li>
                `;
                ulReferralListContainer.append(html);
                $("#btnReferralClaim_" + i).data('referralId', dataRow.id).click(function () {
                    var referralData = $(this).data('referralId');
                    that.#controller.claimReferralAmount(referralData, function () {
                        alert('Claimed Successfully');
                        that.gotoRefPage();
                    });
                });
            }
        });
        $("#CopyRefUrlInput").val(this.#controller.getUserInfoData().referralLink);
    }
    shareReferral() {
        window.open(this.#controller.getUserInfoData().referralLink, '_blank');
    }
    copyToCLipboardRefUrl() {
        // Get the text field
        var copyText = document.getElementById("CopyRefUrlInput");

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);

        // Alert the copied text
        alert("Copied the text: " + copyText.value);
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
}

$(document).ready(function () {
    var navigator = new Navigator();
    navigator.init();
    $("#btnGoToRefPage").click(function () { navigator.gotoRefPage(); });
    $("#btnGoToPlayPage").click(function () { navigator.gotoPlayPage(); });
    $("#btnShareReferral").click(function () { navigator.shareReferral(); });
    $("#btnCopyRefUrl").click(function () { navigator.copyToCLipboardRefUrl(); });
});

