class Navigator {
    #controller = new Controller();
    #helper = new Helper();
    #earnPage = null;
    #mineSyncCounter = 0;
    constructor() {
        this.#earnPage = new EarnPage(this);
    }
    init() {
        var that = this;
        this.#controller.getLandingPageInfo(function (controllerData) {
            that.landingPage(controllerData);
            that.#controller.getLeagueInfo(function (controllerData) { that.setLeagueInfoOnPlayPage(controllerData); });
            //// Run function each second to see if energy bar has some value
            setInterval(function () {
                that.#controller.mineEnergyValue(that.#mineSyncCounter);
                that.#updatePlayePageUi();
                that.#mineSyncCounter++;
                if (that.#mineSyncCounter > 50)
                    that.#mineSyncCounter = 0;
            }, 1000);

        });
        $("#btnCloseDrawer,#backdrop").click(function () {
            that.#helper.closeDrawer();
        });
    }
    #hideAll() {
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
    hideAllDrawerContents() {
        $("#automated_teller_drawer").addClass('hide');
        $("#shop_booster_update_drawer").addClass('hide');
        $("#shop_level_upgrade_drawer").addClass('hide');
        $("#daily_reward_drawer").addClass('hide');
        $("#how_to_play_drawer").addClass('hide');
        $("#faq_drawer").addClass('hide');
        $("#individual_task_drawer").addClass('hide');
        $("#leaderdboard_referral_drawer").addClass('hide');
        $("#leaderdboard_player_drawer").addClass('hide');
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
        this.#hideAll();
        $(".play_container").removeClass('hide');
        $(".footer").removeClass('hide');
        $(".footer_div.active").removeClass('active');
        $("#btnGoToPlayPage").addClass('active');
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
        $("#progressMainPlay").css('width', this.#controller.getEnergyValueInPercent() + '%');
        var energyValue = this.#controller.getEnergyValue();
        $("#txtFillCapacity").text(energyValue);
        if (energyValue > 0)
            $("#miningAnimationValue").removeClass('hide').find('.animated-text').text('+' + (energyValue > userInfoData.miningRate ? userInfoData.miningRate : energyValue));
        else
            $("#miningAnimationValue").addClass('hide');

        $("#more_info_profit_per_hour").text(userInfoData.profitPerHour);
        $("#chkFidgetControl").prop('checked', (userInfoData.isSwipeFidget === "1"));
    }
    gotoRefPage() {
        this.#hideAll();
        $(".ref_container").removeClass('hide');
        $(".footer").removeClass('hide');
        $(".footer_div.active").removeClass('active');
        $("#btnGoToRefPage").addClass('active');

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
        this.#hideAll();
        var that = this;
        $(".footer_div.active").removeClass('active');
        $("#btnGoToEarnPage").addClass('active');

        //// Show hide page
        $(".earn_container").removeClass('hide');
        $(".footer").removeClass('hide');
        $(".community_div").removeClass('hide');

        //// Bind open close tabs
        $("#tabCommunity,#tabDailyTask,#tabRewards").off('click.tabnav').on('click.tabnav', function () { that.#helper.activateTab(this); });
        this.#controller.getEarnPageData(function (dataset) {
            //// Bind TON Fiesta Earnpage details
            that.#earnPage.bindEarnDetailPageForTONFiesta(dataset);

            //// Load partners
            that.#earnPage.loadPartners(dataset);

            //// Load Daily rewards
            that.#earnPage.loadDailyRewards(dataset);
        });
        $("#tabDailyTask").off('click.load').on('click.load', function () {
            that.loadDailyTask();
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
    loadDailyTask() {
        var that = this;
        this.#controller.getDailyTask(function (dataset) {
            that.#earnPage.loadDailyTask(dataset);
        });
    }
    claimDailyTask(taskId, stageId, callbackFn) {
        this.#controller.claimDailyTask(taskId, stageId, callbackFn);
    }
    shareReferral() {
        window.open(this.#controller.getUserInfoData().referralLink, '_blank');
    }
    copyToClipboardRefUrl() {
        this.#helper.copyToClipboardRefUrl("CopyRefUrlInput");
    }
    setLeagueInfoOnPlayPage(data) {
        var currentLeague = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].claimed === true)
                currentLeague = data[i].name;
        }
        $("#currentLeague_Name").text(currentLeague);
        $("#currentLeague_Img").attr('src', `/public/leagues/${currentLeague.toLowerCase()}.png`);
    }
    gotoLeagueInfoPage() {
        this.#hideAll();
        $(".leagues_container").removeClass('hide');

        var that = this;
        var data = this.#controller.getLeagueInfoData();
        var userInfoData = this.#controller.getUserInfoData();
        var leaguesListContainer = $("#leaguesListContainer");
        leaguesListContainer.empty();
        for (var i = 0; i < data.length; i++) {
            var leagueInfo = data[i];
            var progressPercent = userInfoData.balance * 100 / leagueInfo.endRange;
            if (progressPercent > 100)
                progressPercent = 100;
            var html = `
                <div class="leagues_item">
                    <div class="leagues_item_container">
                        <div class="leagues_item_subcontainer">
                            <img src="/public/leagues/${leagueInfo.name.toLowerCase()}.png" height="40px" width="40px" />
                            <div class="leagues_item_content">
                                <p>${leagueInfo.name}</p>
                                <div class="leagues_coin">
                                    <img src="/public/coin.png" height="20px" width="20px" />
                                    <p>${leagueInfo.endRange}</p>
                                </div>
                            </div>
                        </div>
                        ${(leagueInfo.claimed === false && leagueInfo.status === true ?
                    `<button class="claim" id="btnLeagueClaim_${i}">Claim</button>`
                    : leagueInfo.claimed === true && leagueInfo.status === false ?
                        `<img class="tick_btn" src="/public/check-square.svg" alt="tick" height="20px" width="20px" />`
                        : ``)}                        
                    </div>
                    <div class="progress_bar_container">
                        <div class="progress_bar" style="width:${progressPercent}%;"></div>
                    </div>
                </div>            
            `;
            leaguesListContainer.append(html);
            $("#btnLeagueClaim_" + i).off('click').on('click', function () {
                that.#controller.claimLeagueAmount(function () {
                    toast.show('Claimed Successfully');
                    $("#btnGotoLeagueInfoPage").click();
                });
            });
        }
    }
    gotoShopPage() {
        this.#hideAll();
        var that = this;
        $(".footer_div.active").removeClass('active');
        $("#btnGoToShopPage").addClass('active');

        //// Show hide page
        $(".shop_container").removeClass('hide');
        $(".footer").removeClass('hide');
        this.#controller.getUpgradeList(function (dataset) {
            ////Updating UI
            that.#shopPopulatePageUi(dataset);
        });
    }
    #shopPopulatePageUi(dataset) {
        var that = this;
        $("#btnOpenEnergyBarRefillModal .shop_item_content .shop_item_num")
            .text(dataset.boosterStatus.currentEnergyCount + '/' + dataset.boosterStatus.energyDailyLimit);
        $("#btnOpenGPUBoosterModal .shop_item_content .shop_item_num")
            .text(dataset.boosterStatus.currentGPUCount + '/' + dataset.boosterStatus.gpuDailyLimit);

        $("#btnOpen_BarRefillSpeed_LevelUpgrade .shop_level_item_stats .cost-text").text(dataset.spinLevel.nextUpgradeCost);
        $("#btnOpen_BarRefillSpeed_LevelUpgrade .shop_level_item_stats .level-text").text('| ' + (Number(dataset.spinLevel.id) + 1) + ' level');

        $("#btnOpen_EnergyBarCapacity_LevelUpgrade .shop_level_item_stats .cost-text").text(dataset.capacityLevel.nextUpgradeCost);
        $("#btnOpen_EnergyBarCapacity_LevelUpgrade .shop_level_item_stats .level-text").text('| ' + (Number(dataset.capacityLevel.id) + 1) + ' level');

        $("#btnOpen_GPUUpgrade_LevelUpgrade .shop_level_item_stats .cost-text").text(dataset.miningLevel.nextUpgradeCost);
        $("#btnOpen_GPUUpgrade_LevelUpgrade .shop_level_item_stats .level-text").text('| ' + (Number(dataset.miningLevel.id) + 1) + ' level');

        ////Binding click events for booster update
        $("#btnOpenEnergyBarRefillModal").data('upgradeListData', dataset).off('click').on('click', function () {
            var dataset = $(this).data('upgradeListData');
            if (dataset.boosterStatus.currentEnergyCount < 1) {
                toast.show('Booster not ready');
                return;
            }
            var userInfo = that.#controller.getUserInfoData();
            var currentEnergy = that.#controller.getEnergyValue();
            if ((currentEnergy * 2) > userInfo.capacityRate) {
                toast.show('Please consume energy before applying the booster.');
                return;
            }
            that.hideAllDrawerContents();
            that.#helper.openDrawer();
            $("#shop_booster_update_drawer").removeClass('hide');
            $("#shop_booster_update_drawer .drawer_shop_heading").text('Energy Bar Refill');
            $("#shop_booster_update_drawer .drawer_shop_subheading").text('Refill your spark tank to hundred persent.');
            $("#shop_booster_update_drawer .chip").text(dataset.boosterStatus.currentEnergyCount + '/' + dataset.boosterStatus.energyDailyLimit);
            $("#shop_booster_update_img").attr('src', '/public/shop_energy.svg');
            that.#shopBindBoosterUpdateClickEvent('ENERGY');
        });
        $("#btnOpenGPUBoosterModal").data('upgradeListData', dataset).off('click').on('click', function () {
            var dataset = $(this).data('upgradeListData');
            if (dataset.boosterStatus.currentGPUCount < 1) {
                toast.show('Booster not ready');
                return;
            }
            var userInfo = that.#controller.getUserInfoData();
            var currentEnergy = that.#controller.getEnergyValue();
            if ((currentEnergy * 2) < userInfo.capacityRate) {
                toast.show('Please fill energy before applying the booster.');
                return;
            }

            that.hideAllDrawerContents();
            that.#helper.openDrawer();
            $("#shop_booster_update_drawer").removeClass('hide');
            $("#shop_booster_update_drawer .drawer_shop_heading").text('GPU Booster');
            $("#shop_booster_update_drawer .drawer_shop_subheading").text('Convert all energy into points at once.');
            $("#shop_booster_update_drawer .chip").text(dataset.boosterStatus.currentGPUCount + '/' + dataset.boosterStatus.gpuDailyLimit);
            $("#shop_booster_update_img").attr('src', '/public/shop_gpu.svg');
            that.#shopBindBoosterUpdateClickEvent('GPU');
        });

        ////Binding click events for level upgrade
        $("#btnOpen_BarRefillSpeed_LevelUpgrade").data('upgradeListData', dataset).off('click').on('click', function () {
            var dataset = $(this).data('upgradeListData');
            that.hideAllDrawerContents();
            that.#helper.openDrawer();
            $("#shop_level_upgrade_drawer").removeClass('hide');
            $("#shop_level_upgrade_drawer .drawer_shop_heading").text('Bar Refill Speed');
            $("#shop_level_upgrade_drawer .drawer_shop_subheading").text('Increase Recharging Speed By');
            $("#shop_level_upgrade_drawer .chip").html((Number(dataset.spinLevel.id) + 1) + ' <img src="/public/spark_icon.svg" style="width:15px;margin-bottom:-7px;" /> / Per Spin');
            $("#shop_level_upgrade_img").attr('src', '/public/shop_spinner.svg');
            that.#shopBindLevelUpgradeClickEvent('SPIN');
        });
        $("#btnOpen_EnergyBarCapacity_LevelUpgrade").data('upgradeListData', dataset).off('click').on('click', function () {
            var dataset = $(this).data('upgradeListData');
            that.hideAllDrawerContents();
            that.#helper.openDrawer();
            $("#shop_level_upgrade_drawer").removeClass('hide');
            $("#shop_level_upgrade_drawer .drawer_shop_heading").text('Energy Bar');
            $("#shop_level_upgrade_drawer .drawer_shop_subheading").text('Increase Capacity By');
            $("#shop_level_upgrade_drawer .chip").html(dataset.capacityLevel.nextGrowthValue + ' <img src="/public/spark_icon.svg" style="width:15px;margin-bottom:-7px;" />');
            $("#shop_level_upgrade_img").attr('src', '/public/shop_energy_two.svg');
            that.#shopBindLevelUpgradeClickEvent('CAPACITY');
        });
        $("#btnOpen_GPUUpgrade_LevelUpgrade").data('upgradeListData', dataset).off('click').on('click', function () {
            var dataset = $(this).data('upgradeListData');
            that.hideAllDrawerContents();
            that.#helper.openDrawer();
            $("#shop_level_upgrade_drawer").removeClass('hide');
            $("#shop_level_upgrade_drawer .drawer_shop_heading").text('GPU Upgrade');
            $("#shop_level_upgrade_drawer .drawer_shop_subheading").text('Increase Pixel Rate By');
            $("#shop_level_upgrade_drawer .chip").text(dataset.miningLevel.nextGrowthValue + '/ sec');
            $("#shop_level_upgrade_img").attr('src', '/public/shop_gpu_two.svg');
            that.#shopBindLevelUpgradeClickEvent('MINING');
        });
    }
    #shopBindBoosterUpdateClickEvent(type) {
        var that = this;
        $("#btnShopBoosterUpdate").data('boosterUpdateType', type).off('click').on('click', function () {
            var type = $(this).data('boosterUpdateType');
            $("#shop_booster_update_drawer").addClass('hide');
            that.#helper.closeDrawer();
            that.gotoPlayPage();
            that.#controller.shopUpdateBooster(type, function (dataset) {
                if (type === "GPU") {
                    $("#spinnerCanvas").addClass('hide');
                    $("#electrifiedContainer").removeClass('hide')
                    $("#electrifiedFidget").addClass('rotate-fast');
                    $("#progressMainPlay").animate({ 'width': '0%' }, 3000);
                    setTimeout(() => {
                        that.#controller.consumeAllEnergyValue();
                        $("#electrifiedFidget").removeClass('rotate-fast')
                        $("#electrifiedContainer").addClass('hide');
                        $("#spinnerCanvas").removeClass('hide');
                    }, 3000);
                }
                else if (type === "ENERGY") {
                    that.#controller.boostEnergyValue();
                    $("#progressMainPlay").animate({ 'width': '100%' }, 1000);
                }
                that.#updatePlayePageUi();
                toast.show('Boosted Successfully');
            });
        });
    }
    #shopBindLevelUpgradeClickEvent(type) {
        var that = this;
        $("#btnShopLevelUpgrade").data('levelUpgradeType', type).off('click').on('click', function () {
            var type = $(this).data('levelUpgradeType');
            that.#controller.shopUpgradeLevel(type, function (dataset) {
                $("#shop_level_upgrade_drawer").addClass('hide');
                that.#helper.closeDrawer();
                that.gotoShopPage();
                toast.show('Claimed Successfully');
            });
        });
    }
    gotoMorePage() {
        this.#hideAll();
        var that = this;
        $(".footer_div.active").removeClass('active');
        $("#btnGoToMorePage").addClass('active');

        //// Show hide page
        $(".more_container").removeClass('hide');
        $(".footer").removeClass('hide');
        this.#controller.getLeagueInfo(function (controllerData) {
            var cardContainer = $("#more-carousel-list");
            cardContainer.empty();
            var currentBalance = that.#controller.getUserInfoData().balance;
            for (var i = 0; i < controllerData.length; i++) {
                if (controllerData[i].cards !== null) {
                    var completionPercent = 100;
                    if (currentBalance < controllerData[i].endRange) {
                        completionPercent = (currentBalance / controllerData[i].endRange) * 100;
                    }
                    var cardHtml = `
                    <div class="more_cards">
                        <h3 class="more_cards_heading">${controllerData[i].cards.name}</h3>
                        <div class="more_card_content">
                            ${(controllerData[i].claimed === false ? '<img class="gpu_card_lock" src="/public/padlock.svg" height="85px" width="85px" />' : '')}
                            <img class="gpu_card_img" src="${controllerData[i].cards.image}" alt="card" />
                        </div>
                        <h3>${(currentBalance > controllerData[i].endRange ? controllerData[i].endRange : currentBalance)} / ${controllerData[i].endRange}</h3>
                        <div class="progress_bar_container">
                            <div class="progress_bar" style="width:${completionPercent}%;"></div>
                        </div>
                    </div>`;
                    cardContainer.append(cardHtml);
                }
            }
        });

        //// Bind open close tabs
        $("#more_card_tab,#more_boost_stake_tab,#more_info_tab").off('click.tabnav').on('click.tabnav', function () { that.#helper.activateTab(this); });
        $("#more_card_tab").click();
        $("#how_to_play_div").off('click').on('click', function () {
            that.hideAllDrawerContents();
            that.#helper.openDrawer();
            $("#how_to_play_drawer").removeClass('hide');
        });
        $("#faqs_div").off('click').on('click', function () {
            that.hideAllDrawerContents();
            that.#helper.openDrawer();
            $("#faq_drawer").removeClass('hide');
        });
        $("#openMoreInfoLeaderboard_Referral_drawer").off('click').on('click', function () {
            that.hideAllDrawerContents();
            that.#helper.openDrawer();
            $("#leaderdboard_referral_drawer").removeClass('hide');
            that.#bindLeaderboardReferral();
        });
        $("#chkLeaderboard_Referral_Dateflag").off('change').on('change', function () {
            that.#bindLeaderboardReferral();
        });
        $("#openMoreInfoLeaderboard_Player_drawer").off('click').on('click', function () {
            that.hideAllDrawerContents();
            that.#helper.openDrawer();
            $("#leaderdboard_player_drawer").removeClass('hide');
            that.#bindLeaderboardPlayer();
        });
    }
    #bindLeaderboardReferral() {
        var that = this;
        var subheader = $("#leaderdboard_referral_drawer .referral_subheader");
        var mainContainer = $("#leaderdboard_referral_drawer .referral_top_100");
        subheader.empty();
        mainContainer.empty();
        that.#controller.getLeaderboardReferral($("#chkLeaderboard_Referral_Dateflag").is(':checked'), function (controllerData) {
            if (controllerData.refferals.length > 0) { //////Bind sub header

                subheader.append(that.#bindMoreInfoLeaderboardCardHtml(controllerData.refferals[0], 0, true));
            }
            //// Bind main data
            if (controllerData.refferals.length > 1) {
                for (var i = 1; i < controllerData.refferals.length; i++) {
                    mainContainer.append(that.#bindMoreInfoLeaderboardCardHtml(controllerData.refferals[i], i, true));
                }
            }
        });
    }
    #bindLeaderboardPlayer() {
        var that = this;
        var subheader = $("#leaderdboard_player_drawer .referral_subheader");
        var mainContainer = $("#leaderdboard_player_drawer .referral_top_100");
        subheader.empty();
        mainContainer.empty();
        that.#controller.getLeaderboardPlayer(function (controllerData) {
            if (controllerData.users.length > 0) { //////Bind sub header

                subheader.append(that.#bindMoreInfoLeaderboardCardHtml(controllerData.users[0], 0, false));
            }
            //// Bind main data
            if (controllerData.users.length > 1) {
                for (var i = 1; i < controllerData.users.length; i++) {
                    mainContainer.append(that.#bindMoreInfoLeaderboardCardHtml(controllerData.users[i], i, false));
                }
            }
        });
    }
    #bindMoreInfoLeaderboardCardHtml(data, index, isForRefferal) {
        var shortName = '';
        if (data.handle !== null && data.handle.length > 1) {
            shortName = data.handle.substr(0, 2).toUpperCase();
        }
        var html = `
                    ${(index === 0 ? '<p class="referral_p">Me</p>' : '')}
                    <div class="custom_card">
                        <div class="custom_card_user_info">
                        <div class="user_profile_name">
                            <p>${shortName}</p>
                        </div>
                        <div class="user_info">
                            <p class="referral_p user_name">${data.handle}</p>
                            <div class="referrals_coins">
                            <img src="/public/coin.png" height="20px" width="20px" />
                            <p class="referral_p user_referral_count">${(isForRefferal === true ? data.referral_bonus : data.points).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                        </div>
                        </div>
                        <div class="user_info user_rank_div">
                        <p class="referral_p">#${(isForRefferal === true ? data.rank : data.user_rank)}</p>
                        <p class="referral_p ${(isForRefferal === true ? '' : 'hide')}">${data.referral_count}</p>
                        </div>
                    </div>
                    `;
        return html;
    }
    toggleFidgetControl() {
        this.#controller.toggleFidgetControl($("#chkFidgetControl").is(':checked'));
    }
    increaseEnergyValue() {
        this.#controller.increaseEnergyValue();
        this.#updatePlayePageUi();
    }
    isSwipeEnabled() {
        return this.#controller.getUserInfoData().isSwipeFidget === "1";
    }
    triggerHapticFeedback() {
        try {
            const data = JSON.stringify({
                eventType: 'web_app_trigger_haptic_feedback',
                eventData: {
                    type: 'impact',
                    impact_style: 'heavy'
                },
            });

            window.parent.postMessage(data, 'https://web.telegram.org');
            console.warn('ToN:Custom Message');
            const data1 = JSON.stringify({
                eventType: 'web_app_setup_back_button',
                eventData: {
                    is_visible: true,
                },
            });

            window.parent.postMessage(data1, 'https://web.telegram.org');
        }
        catch (ex) {
            console.warn('ToN:triggerHapticFeedback|' + ex);
        }
    }

}
$(document).ready(function () {
    var customNavigator = new Navigator();
    customNavigator.init();
    $("#btnGoToRefPage").click(function () { customNavigator.gotoRefPage(); });
    $("#btnGoToPlayPage").click(function () { customNavigator.gotoPlayPage(); });
    $("#btnShareReferral").click(function () { customNavigator.shareReferral(); });
    $("#btnCopyRefUrl").click(function () { customNavigator.copyToClipboardRefUrl(); });
    $("#btnGoToEarnPage").click(function () { customNavigator.gotoEarnPage(); });
    $("#btnBackToEarnPage").click(function () {
        $(".earn_container").removeClass('hide');
        $(".earn_detail_container").addClass('hide');
    });
    $("#btnGotoLeagueInfoPage").click(function () { customNavigator.gotoLeagueInfoPage(); });
    $(".leagues_close_icon").click(function () { customNavigator.gotoPlayPage(); });
    $("#btnGoToShopPage").click(function () { customNavigator.gotoShopPage(); });
    $("#btnGoToMorePage").click(function () { customNavigator.gotoMorePage(); });
    $("#chkFidgetControl").change(function () { customNavigator.toggleFidgetControl(); });

    var customSpinner = new Spinner(customNavigator);
    customSpinner.init();
});

