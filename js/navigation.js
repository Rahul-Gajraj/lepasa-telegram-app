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
        this.openDrawer();
        $("#automated_teller_drawer").removeClass('hide');
        $("#txtVestingAmount").text(vestingAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        var that = this;
        $("#automated_teller_claim").off('click').on('click', function () {
            that.#controller.claimVestingAmount(function () {
                that.#updatePlayePageUi();
                $("#automated_teller_drawer").addClass('hide');
                that.closeDrawer();
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

        //// Open close tabs
        $("#tabCommunity,#tabDailyTask,#tabRewards").off('click').on('click', function () { that.activateTab(this); });
        this.#controller.getEarnPageData(function (dataset) {
            //// Load partners
            var partnerContainer = $(".community_card_partner_content");
            partnerContainer.empty();
            var partnerData = dataset.partners;
            //// Loop through partner dataset
            for (var i = 0; i < partnerData.length; i++) {
                var dataRow = partnerData[i];
                var html = `
                <div class="community_card_content partner_content">
                    <div class="community_info">
                        <img src="${dataRow.partner_logo}" alt="logo" height="30px" width="30px" />
                        <div class="community_name">
                        <p>${dataRow.name}</p>
                        </div>
                    </div>
                    <div id="gotoEarnDetailPage_${i}">&gt;</div>
                </div>
                `;
                partnerContainer.append(html);
                //// Binding click event for go to earn detail page
                $("#gotoEarnDetailPage_" + i).data('partnerInfo', dataRow).click(function () {
                    var partnerInfo = $(this).data('partnerInfo');
                    $("#earn_detail_title").text(partnerInfo.name);
                    $("#earn_detail_description").text(partnerInfo.description);
                    var earnDetailContainer = $("#earn_detail_content");
                    earnDetailContainer.empty();
                    //// Before showing earn detail page, loop through selected partner and show its task
                    for (var j = 0; j < partnerInfo.tasks.length; j++) {
                        var taskHtml = `
                                  <div class="earn_card_content">
                                    <div class="community_info">
                                    <img src="${partnerInfo.tasks[j].logo}" alt="twitter" height="25px" width="25px" />
                                    <div class="community_name">
                                        <p>${partnerInfo.tasks[j].task_name}</p>
                                        <div class="community_desc">
                                            <img height="20px" width="20px" src="/public/coin.png" alt="coin" />
                                            <p>${partnerInfo.tasks[j].amount}</p>
                                        </div>
                                    </div>
                                    </div>
                                    ${(partnerInfo.tasks[j].status === true ? `<span>Claimed</span>` : `<button class="claim" id="btnEarnPartnerTaskClaim_${j}">Claim</button>`)}                                    
                                </div>
                        `;
                        earnDetailContainer.append(taskHtml);
                        //// Bind the click event of task claim button
                        $("#btnEarnPartnerTaskClaim_" + j).data('partnerTaskInfo', partnerInfo.tasks[j]).data('rowIndex', i)
                            .click(function () {
                                var partnerTaskInfo = $(this).data('partnerTaskInfo');
                                //// If first click then open link in new window and set text as verifying
                                if ($(this).data('isClaimClicked') !== true) {
                                    $(this).data('isClaimClicked', true);
                                    window.open(partnerTaskInfo.link, '_blank');
                                    $(this).text('Verify');
                                }
                                else {
                                    //// If second click then call controller
                                    $(this).text('Verifying...').attr('disabled', 'disabled');
                                    var $btnRef = $(this);
                                    setTimeout(() => {
                                        that.claimPartnerTask(partnerTaskInfo.id, function (claimPartnerTaskResponse) {
                                            var rowIndex = $btnRef.data('rowIndex');
                                            toast.show('Claimed successfully.');
                                            $("#gotoEarnDetailPage_" + rowIndex).click();
                                        });
                                    }, 3000);
                                }
                            });
                    }

                    $(".earn_container").addClass('hide');
                    $(".earn_detail_container").removeClass('hide');
                });
            }

            //// Load Daily tasks

        });
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
        toast.show("Copied the text: " + copyText.value);
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
    activateTab(tabToActivate) {
        var tabWrapper = $(tabToActivate).parents('.tab-wrapper');
        var listContainers = tabWrapper.find('.tab-container');
        listContainers.each(function () { $(this).addClass('hide'); });
        tabWrapper.find('.' + $(tabToActivate).attr('data-tab')).removeClass('hide');
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

