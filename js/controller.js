class Controller {
    #initData = '';
    #baseApiUrl = null;
    #userInfoData = null;
    #leagueInfoData = null;
    #energyValue = 0;
    #balanceToSync = 0;

    #helper = new Helper();
    constructor() {
        var config = new Config();
        if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            $(".qr_code_div").removeClass('hide');
        }
        else {
            $(".loading_screen").removeClass('hide');
            this.#baseApiUrl = config.getBaseApiUrl();
            if (Telegram.WebApp.initData && Telegram.WebApp.initData !== "")
                this.#initData = Telegram.WebApp.initData;
            else
                this.#initData = config.getDevInitData();
        }
    }

    getLandingPageInfo(reffUrl, successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/get-info',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                initData: that.#initData,
                referralCode: reffUrl === '' || reffUrl === null ? null : reffUrl,
                timeDifference: that.#helper.getDateTimeDifference(),
                timezone: that.#helper.getDateTimeZone(),
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData = returnData.data;
                    // var tempData = that.#userInfoData;
                    // tempData.isFreshUser = 1;
                    // successCallback(tempData);
                    // return;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    updateWelcomeClaim(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/fresh-user-claimed',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    claimVestingAmount(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/claim-vesting-amount',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    that.#userInfoData.vestingAmount = 0;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    getReferralList(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/referral-list',
            type: 'POST',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    if (successCallback)
                        successCallback(returnData.data);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    claimReferralAmount(referralId, successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/claim-referral',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId,
                requestId: referralId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    getEarnPageData(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/daily-bonus-report',
            type: 'POST',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    if (successCallback)
                        successCallback(returnData.data);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    claimPartnerTask(taskId, successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/claim-partner-task',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId,
                taskId: taskId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    claimTONFiestaSocialTask(socialName, successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/check-social-reward',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId,
                type: socialName
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    if (returnData.data && returnData.data.balance)
                        that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(returnData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    claimDailyRewards(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/claim-daily-bonus',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    getDailyTask(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/daily-task',
            type: 'POST',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    if (successCallback)
                        successCallback(returnData.data);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    claimDailyTask(taskId, stageId, successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/claim-daily-task',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId,
                taskId: taskId,
                stageId: stageId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    claimWalletConnect(accountAddress, successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/connect-wallet',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId,
                address: accountAddress
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    disconnectWalletConnect(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/disconnect-wallet',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    getLeagueInfo(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/league-info',
            type: 'POST',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#leagueInfoData = returnData.data;
                    if (successCallback)
                        successCallback(returnData.data);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    claimLeagueAmount(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/claim-rank',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    that.#leagueInfoData = returnData.data.leagueInfo;
                    if (successCallback)
                        successCallback(that.#userInfoData);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    getUpgradeList(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/upgrade-list',
            type: 'POST',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    ////TODO: Update local userInfoData with relevent values.
                    //that.#userInfoData.something = returnData.data.something;
                    if (successCallback)
                        successCallback(returnData.data);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    shopUpdateBooster(updateType, successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/update-booster',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId,
                type: updateType
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(returnData.data);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    shopUpgradeLevel(updateType, successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/upgrade-level',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId,
                type: updateType
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.balance = returnData.data.balance;
                    if (successCallback)
                        successCallback(returnData.data);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    syncBalance(successCallback) {
        var that = this;
        var balanceToSync = that.#balanceToSync;
        that.#balanceToSync = 0;
        var timestampMills = that.#helper.getTimeStampMiliseconds();
        doCryptEnc(that.#initData + timestampMills, function (cbData) {
            $.ajax({
                url: that.#baseApiUrl + '/user/earn-reward',
                contentType: "application/json",
                headers: {
                    'authorization': 'Bearer ' + that.#userInfoData.authorization,
                    'token': cbData
                },
                type: 'POST',
                data: JSON.stringify({
                    encryptId: that.#userInfoData.encryptId,
                    initData: that.#initData,
                    balance: balanceToSync,
                    timestamp: timestampMills
                }),
                success: function (returnData) {
                    if (returnData.status === true) {
                        // that.#userInfoData.balance = returnData.data.balance;
                        if (successCallback)
                            successCallback(returnData.data);
                    }
                    else {
                        that.#balanceToSync += balanceToSync; ////Restore balance to sync in case of fail
                        toast.show(returnData.error);
                    }
                },
                error: function (error) {
                    that.#balanceToSync += balanceToSync; ////Restore balance to sync in case of fail
                    that.#handleUnexpectedError(error);
                }
            });
        });
    }
    toggleFidgetControl(isSwipe) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/update-fidget',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId,
                isSwipe: isSwipe
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    that.#userInfoData.isSwipeFidget = isSwipe === true ? "1" : "0";
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    getLeaderboardReferral(dateflag, successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/fetch-referrals',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId,
                dateflag: dateflag
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    if (successCallback)
                        successCallback(returnData.data);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    getLeaderboardPlayer(successCallback) {
        var that = this;
        $.ajax({
            url: that.#baseApiUrl + '/user/leaderboard',
            contentType: "application/json",
            headers: { 'authorization': 'Bearer ' + that.#userInfoData.authorization },
            type: 'POST',
            data: JSON.stringify({
                encryptId: that.#userInfoData.encryptId
            }),
            success: function (returnData) {
                if (returnData.status === true) {
                    if (successCallback)
                        successCallback(returnData.data);
                }
                else toast.show(returnData.error);
            },
            error: function (error) { that.#handleUnexpectedError(error); }
        });
    }
    getUserInfoData() {
        return this.#userInfoData;
    }
    getLeagueInfoData() {
        return this.#leagueInfoData;
    }
    increaseEnergyValue() {
        var spinRate = this.#userInfoData.spinRate;
        var capacityRate = this.#userInfoData.capacityRate;
        var currentEnergyVal = this.#energyValue;
        currentEnergyVal = currentEnergyVal + Math.ceil(spinRate);
        if (currentEnergyVal > capacityRate)
            currentEnergyVal = capacityRate;
        this.#energyValue = currentEnergyVal;
    }
    boostEnergyValue() {
        var capacityRate = this.#userInfoData.capacityRate;
        this.#energyValue = capacityRate;
    }
    mineEnergyValue(syncCounter) {
        var energyValue = this.#energyValue;
        if (energyValue > 0) {
            var miningRate = this.#userInfoData.miningRate;
            var energyToConsume = Math.ceil(miningRate / 2); //// Energy to conusme per second as per GPU, miningRate/2
            var miningEnergy = energyValue > energyToConsume ? energyToConsume : energyValue;
            var halfMiningRate = Math.ceil(miningRate / 2);
            var pointsGenerated = ((halfMiningRate + miningRate) / halfMiningRate) * miningEnergy;

            this.#energyValue -= miningEnergy;
            this.#userInfoData.balance += pointsGenerated;
            this.#balanceToSync += pointsGenerated;
        }
        ///// Sync to server each 5 seconds
        if (syncCounter % 5 === 0 && this.#balanceToSync > 0) {
            this.syncBalance();
        }
    }
    consumeAllEnergyValue() {
        var energyToConsume = this.#energyValue;
        if (energyToConsume > 0) {
            var miningRate = this.#userInfoData.miningRate;
            var pointsGenerated = energyToConsume * (Math.ceil(miningRate / 2) + miningRate);
            this.#energyValue = 0;
            this.#userInfoData.balance += pointsGenerated;
            this.#balanceToSync += pointsGenerated;
        }
        ///// Sync to server each 5 seconds
        this.syncBalance();
    }
    getEnergyValue() {
        return this.#energyValue;
    }
    getEnergyValueInPercent() {
        return (this.#energyValue / this.#userInfoData.capacityRate) * 100;
    }
    #handleUnexpectedError(error) {
        if (error.status === 401)
            toast.show('Multiple login detacted or session expired. Please re-open app on this device.');
        else
            alert("Something went wrong. Please try again later.");
    }
}