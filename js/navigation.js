class Navigator {
    #controller = new Controller();
    #helper = new Helper();
    #earnPage = null;
    constructor() {
        this.#earnPage = new EarnPage(this);
    }
    init() {
        var that = this;
        this.#controller.getLandingPageInfo(function (controllerData) { that.landingPage(controllerData); });
        $("#btnCloseDrawer,#backdrop").click(function () {
            that.#helper.closeDrawer();
        });

    }
    hideAll() {
        $(".loading_screen").addClass('hide');
        $(".welcome_screen").addClass('hide');
        $(".welcome_bonus_wrapper").addClass('hide');
        $(".login_verification").addClass('hide');
        $(".play_container").addClass('hide');
        $(".earn_container").addClass('hide');
        $(".community_div").addClass('hide');
        $(".task_container").addClass('hide');
        $(".rewards_container").addClass('hide');
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
        this.#helper.openDrawer();
        $("#automated_teller_drawer").removeClass('hide');
        $("#txtVestingAmount").text(vestingAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        var that = this;
        $("#automated_teller_claim").off('click').on('click', function () {
            that.#controller.claimVestingAmount(function () {
                that.#updatePlayePageUi();
                $("#automated_teller_drawer").addClass('hide');
                that.#helper.closeDrawer();
                toast.show('Claimed Successfully');
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
                        toast.show('Claimed Successfully');
                        that.gotoRefPage();
                    });
                });
            }
        });
        $("#CopyRefUrlInput").val(this.#controller.getUserInfoData().referralLink);
    }
    gotoEarnPage() {
        this.hideAll();
        var that = this;

        //// Show hide page
        $(".earn_container").removeClass('hide');
        $(".footer").removeClass('hide');
        $(".community_div").removeClass('hide');

        //// Bind open close tabs
        $("#tabCommunity,#tabDailyTask,#tabRewards").off('click').on('click', function () { that.#helper.activateTab(this); });
        this.#controller.getEarnPageData(function (dataset) {
            //// Bind TON Fiesta Earnpage details
            that.#earnPage.bindEarnDetailPageForTONFiesta(dataset);

            //// Load partners
            that.#earnPage.loadPartners(dataset);

            //// Load Daily rewards
            that.#earnPage.loadDailyRewards(dataset);
        });
    }
    claimPartnerTask(taskId, callbackFn) {
        this.#controller.claimPartnerTask(taskId, callbackFn);
    }
    claimTONFiestaSocialTask(socialName, callbackFn) {
        this.#controller.claimTONFiestaSocialTask(socialName, callbackFn);
    }
    claimDailyRewards(callbackFn) {
        this.#controller.claimDailyRewards(callbackFn);
    }
    shareReferral() {
        window.open(this.#controller.getUserInfoData().referralLink, '_blank');
    }
    copyToCLipboardRefUrl() {
        this.#helper.copyToCLipboardRefUrl("CopyRefUrlInput");
    }
}

$(document).ready(function () {
    var navigator = new Navigator();
    navigator.init();
    $("#btnGoToRefPage").click(function () { navigator.gotoRefPage(); });
    $("#btnGoToPlayPage").click(function () { navigator.gotoPlayPage(); });
    $("#btnShareReferral").click(function () { navigator.shareReferral(); });
    $("#btnCopyRefUrl").click(function () { navigator.copyToCLipboardRefUrl(); });
    $("#btnGoToEarnPage").click(function () { navigator.gotoEarnPage(); });
    $("#btnBackToEarnPage").click(function () {
        $(".earn_container").removeClass('hide');
        $(".earn_detail_container").addClass('hide');
    });
});

