class EarnPage {
    #navigationReference = null;
    #helper = null;
    constructor(navigationReference) {
        this.#navigationReference = navigationReference;
        this.#helper = new Helper();
    }
    loadPartners(dataset) {
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
            var that = this;
            //// Binding click event for go to earn detail page
            $("#gotoEarnDetailPage_" + i).data('partnerInfo', dataRow).click(function () {
                that.bindEarnDetailPageForPartners($(this));
            });
        }
    }
    bindEarnDetailPageForPartners($elem) {
        var partnerInfo = $elem.data('partnerInfo');
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
                        ${(partnerInfo.tasks[j].status === true ? `<img class="tick_btn" src="/public/check-square.svg" alt="tick" height="20px" width="20px" />` : `<button class="claim" id="btnEarnPartnerTaskClaim_${j}">Claim</button>`)}                                    
                    </div>
            `;
            earnDetailContainer.append(taskHtml);
            var that = this;
            //// Bind the click event of task claim button
            $("#btnEarnPartnerTaskClaim_" + j).data('partnerTaskInfo', partnerInfo.tasks[j]).click(function () {
                that.claimAndVerifyPartnerTask($(this));
            });
        }

        $(".earn_container").addClass('hide');
        $(".earn_detail_container").removeClass('hide');
    }
    claimAndVerifyPartnerTask($elem) {
        var partnerTaskInfo = $elem.data('partnerTaskInfo');
        //// If first click then open link in new window and set text as verifying
        if ($elem.data('isClaimClicked') !== true) {
            $elem.data('isClaimClicked', true);
            window.open(partnerTaskInfo.link, '_blank');
            $elem.text('Verify');
        }
        else {
            //// If second click then call controller
            $elem.text('Verifying...').attr('disabled', 'disabled');
            var that = this;
            setTimeout(() => {
                that.#navigationReference.claimPartnerTask(partnerTaskInfo.id, function (claimPartnerTaskResponse) {
                    toast.show('Claimed successfully.');
                    $elem.replaceWith('<img class="tick_btn" src="/public/check-square.svg" alt="tick" height="20px" width="20px" />');
                });
            }, 3000);
        }

    }
    bindEarnDetailPageForTONFiesta(dataset) {
        var that = this;
        $("#btnGotoTONFiestaEarnDetails").click(function () {
            $("#earn_detail_title").text('TON Fiesta');
            $("#earn_detail_description").text(`Welcome to Ton Fiesta, A dynamic gaming experience within Telegram
            where you can earn points, level up, and unlock exclusive rewards.`);

            var earnDetailContainer = $("#earn_detail_content");
            earnDetailContainer.empty();
            //// Before showing earn detail page, loop through social and show its task
            for (var i = 0; i < dataset.socialRewardReport.length; i++) {
                var socialRewardRow = dataset.socialRewardReport[i];
                if (socialRewardRow.name === "TWITTER")
                    socialRewardRow.logo = "/public/twitter.svg";
                else if (socialRewardRow.name === "TELEGRAM_CHANNEL")
                    socialRewardRow.logo = "/public/telegram.svg";
                var taskHtml = `
                    <div class="earn_card_content">
                        <div class="community_info">
                            <img src="${socialRewardRow.logo}" alt="logo" height="25px" width="25px" />
                            <div class="community_name">
                                <p>${socialRewardRow.name}</p>
                                <div class="community_desc">
                                    <img height="20px" width="20px" src="/public/coin.png" alt="coin" />
                                    <p>${socialRewardRow.amount}</p>
                                </div>
                            </div>
                        </div>
                        ${(socialRewardRow.status === true ? `<img class="tick_btn" src="/public/check-square.svg" alt="tick" height="20px" width="20px" />` : `<button class="claim" id="btnTonFSocialClaim_${i}">Claim</button>`)}                                    
                    </div>
            `;
                earnDetailContainer.append(taskHtml);
                //// Bind the click event of task claim button
                $("#btnTonFSocialClaim_" + i).data('socialRewardInfo', socialRewardRow).click(function () {
                    that.claimAndVerifyTonFSocialTask($(this));
                });
            }

            //// Add wallet row into the above html
            earnDetailContainer.append(`
                    <div class="earn_card_content">
                        <div class="community_info">
                            <img src="/public/wallet.svg" alt="wallet" height="25px" width="25px" />
                            <div class="community_name">
                                <p>Connect Wallet</p>
                                <div class="community_desc">
                                    <img height="20px" width="20px" src="/public/coin.png" alt="coin" />
                                    <p>${dataset.walletConnectReport.amount}</p>
                                </div>
                            </div>
                        </div>
                        ${(dataset.walletConnectReport.status === true
                    ? `<button class="claim" id="btnWalletDisconnect">Disconnect</button>`
                    : `<button class="claim" id="btnWalletConnect">Connect</button>`)}                                    
                    </div>
                
            `);
            $(".earn_container").addClass('hide');
            $(".earn_detail_container").removeClass('hide');
        });
    }
    claimAndVerifyTonFSocialTask($elem) {
        var socialRewardInfo = $elem.data('socialRewardInfo');
        //// If first click then open link in new window and set text as verifying
        if ($elem.data('isClaimClicked') !== true) {
            $elem.data('isClaimClicked', true);
            window.open(socialRewardInfo.link, '_blank');
            $elem.text('Verify');
        }
        else {
            //// If second click then call controller
            $elem.text('Verifying...').attr('disabled', 'disabled');
            var that = this;
            setTimeout(() => {
                that.#navigationReference.claimTONFiestaSocialTask(socialRewardInfo.name, function (claimResponse) {
                    if (claimResponse.data !== false) {
                        toast.show('Claimed successfully.');
                        $elem.replaceWith('<img class="tick_btn" src="/public/check-square.svg" alt="tick" height="20px" width="20px" />');
                    }
                    else {
                        toast.show('Unable to claim! Please complete the task.');
                        $elem.text('Claim').data('isClaimClicked', null).removeAttr('disabled');
                    }
                });
            }, 3000);
        }

    }
    loadDailyRewards(dataset) {
        var dailyRewardContainer = $("#rewards_container_content");
        dailyRewardContainer.empty();
        var dailyRewards = dataset.dailyReport;
        //// Loop through dailyRewards dataset
        for (var i = 0; i < dailyRewards.length; i++) {
            var dataRow = dailyRewards[i];
            var html = `
                <div class="daily_reward_card">
                    <div class="daily_reward_info">
                    <img height="23px" src="/public/calender/${dataRow.name.replace('Day ', '')}.svg" alt="calender-${dataRow.name.replace('Day ', '')}" />
                    <div class="daily_reward_detail">
                        <div class="daily_reward_amount">
                        <img height="20px" src="/public/coin.png" />
                        <p class="reward_amount">${dataRow.points}</p>
                        </div>
                    </div>
                    </div>
                    ${(
                    dataRow.status === 1
                        ? `<button class="claim" id="btnDailyRewardClaim_${i}">Check In</button>`
                        : dataRow.status === 2 ? `<img class="tick_btn" src="/public/check-square.svg" alt="tick" height="20px" width="20px" />`
                            : `<button class="claim disabled" disabled="disabled">Check In</button>`
                )}  
                </div>
            `;
            dailyRewardContainer.append(html);
            var that = this;
            //// Binding click event for go to earn detail page
            $("#btnDailyRewardClaim_" + i).click(function () {
                var $elem = $(this);
                that.#navigationReference.claimDailyRewards(function (claimResponse) {
                    toast.show('Claimed successfully.');
                    $elem.replaceWith('<button class="claim disabled" disabled="disabled">Check In</button>');
                });
            });
        }
    }
    loadDailyTask(dataset) {
        var dailyTaskContainer = $("#dailyTaskContainer");
        dailyTaskContainer.empty();
        //// Loop through dataset
        for (var i = 0; i < dataset.length; i++) {
            var dataRow = dataset[i];
            var html = `
                <div class="task_container_card ${dataRow.isOpen === true ? `` : `disabled`}" id="btnDailyTask${dataRow.isOpen === true ? `` : `Non`}Opener_${i}">
                    <div class="task_card_content">
                        <img class="task_card_logo" src="${dataRow.symbol}" height="30px" width="30px" />
                        <div class="task_card_content_body">
                            <p>${dataRow.name}</p>
                            <p class="profit_per_hour">Profit Per Hour</p>
                            <div class="task_card_content_footer">
                                <img src="/public/coin.png" height="20px" width="20px" />
                                <p>${dataRow.earning}</p>
                            </div>
                        </div>
                    </div>
                    <div class="task_card_footer">
                        <p class="task_card_footer_p">${dataRow.stage}</p>
                        <div class="task_card_footer_divider"></div>
                        <div class="task_card_footer_coin_div">
                            <img src="/public/coin.png" height="20px" width="20px" />
                            <p>${dataRow.price}</p>
                        </div>
                    </div>
                </div>
            `;
            dailyTaskContainer.append(html);
            var that = this;
            //// Binding click event for go to daily task detail page
            $("#btnDailyTaskOpener_" + i).data('dailyTaskData', dataRow).click(function () {
                var dailyTaskData = $(this).data('dailyTaskData');
                $("#individual_task_logo").attr('src', dailyTaskData.symbol);
                $("#individual_task_name").text(dailyTaskData.name);
                $("#individual_task_description").text(dailyTaskData.desc);
                $("#individual_task_earning").text(dailyTaskData.earning);
                $("#individual_task_price").text(dailyTaskData.price);
                //// Open drawer
                that.#navigationReference.hideAllDrawerContents();
                $("#individual_task_drawer").removeClass('hide');
                that.#helper.openDrawer();

                if (dailyTaskData.isOpen === true){
                    $("#btnIndividualTaskClaim").removeClass('hide').off('click.dailytask').on('click.dailytask', function () {
                        that.#navigationReference.claimDailyTask(dailyTaskData.taskId, dailyTaskData.stageId, function (claimResponse) {
                            that.#helper.closeDrawer();
                            toast.show('Claimed successfully.');
                            $("#tabDailyTask").trigger('click.load');
                        });
                    });
                }
                else{
                    $("#btnIndividualTaskClaim").addClass('hide');
                }
            });
        }
    }
}